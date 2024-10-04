import { Request, Response } from 'express'; 
import mongoose from 'mongoose'; 
import Calculation, { ICalculation } from "../models/Calculation"; 
import RabbitMQService from '../rabbitmq/serviceRabbit'; 

export const createCalculation = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Recebendo requisição de criação com body:", JSON.stringify(req.body, null, 2));
    const { number1, number2 } = req.body;

    // Valida se os parâmetros foram fornecidos
    if (number1 == null || number2 == null) {
      console.warn("Parâmetros faltando: number1 ou number2 não foram fornecidos.");
      res.status(400).json({ error: 'Parâmetros faltando: number1 ou number2 não foram fornecidos.' });
      return;
    }

    // Verifica se já existe um cálculo com os mesmos parâmetros (independente do status)
    const existingCalculation = await Calculation.findOne({ number1, number2 });

    if (existingCalculation) {
      console.warn("Cálculo já existe com os mesmos parâmetros.");
      res.status(400).json({ error: 'Cálculo já existe com os mesmos parâmetros.' });
      return;
    }

    // Cria o cálculo com status 'pending'
    const calculation = new Calculation({ number1, number2, status: "pending" });
    const savedCalculation = await calculation.save();
    console.log("Novo cálculo criado com sucesso:", savedCalculation);

    // Envia para a fila do RabbitMQ
    console.log("Enviando para a fila...");
    await RabbitMQService.sendToQueue('calculationQueue', savedCalculation);

    // Retorna a resposta com o cálculo criado
    res.status(201).json(savedCalculation);

  } catch (error) {
    console.error('Erro ao criar cálculo:', error);
    res.status(500).json({ error: 'Erro ao criar cálculo', details: error });
  }
};

export const getAllCalculations = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const calculations = await Calculation.find(); 
   
    res.json(calculations);

  } catch (error) {
    console.error('Erro ao buscar cálculos:', error);
    res.status(500).json({ error: 'Erro ao buscar cálculos', details: error });
  }
};



export const updateCalculation = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Recebendo requisição de atualização com body:", JSON.stringify(req.body, null, 2));
    const { id } = req.params;
    const { number1, number2 } = req.body;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    
    const existingCalculation = await Calculation.findById(id);

    if (!existingCalculation) {
      console.warn(`Cálculo com ID ${id} não encontrado para atualização.`);
      res.status(404).json({ error: 'Cálculo não encontrado' });
      return;
    }

    
    if (number1 != null || number2 != null) {
      existingCalculation.number1 = number1 != null ? number1 : existingCalculation.number1;
      existingCalculation.number2 = number2 != null ? number2 : existingCalculation.number2;
      existingCalculation.status = 'pending'; 
      existingCalculation.result = undefined; 
    }

    
    const updatedCalculation = await existingCalculation.save();
    console.log("Cálculo atualizado com sucesso:", updatedCalculation);

    
    await RabbitMQService.sendToQueue('calculationQueue', updatedCalculation);

    res.json({ success: 'Cálculo atualizado com sucesso', updatedCalculation });

  } catch (error) {
    console.error("Erro ao atualizar cálculo:", error);
    res.status(500).json({ error: 'Erro ao atualizar cálculo', details: error });
  }
};



export const deleteCalculation = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Recebendo requisição para deletar cálculo com ID:", req.params.id);
    const { id } = req.params;

  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    if (!id) {
      console.warn("ID não foi fornecido na requisição.");
      res.status(400).json({ error: 'ID não foi fornecido.' });
      return;
    }

    
    const deletedCalculation = await Calculation.findByIdAndDelete(id);
    if (!deletedCalculation) {
      
      res.status(404).json({ error: 'Cálculo não encontrado' });
      return;
    }

    console.log(`Cálculo com ID ${id} deletado com sucesso.`);
    res.status(200).json({ success: 'Cálculo deletado com sucesso' });
  } catch (error) {
    console.error("Erro ao deletar cálculo:", error);
    res.status(500).json({ error: 'Erro ao deletar cálculo', details: error });
  }
};
