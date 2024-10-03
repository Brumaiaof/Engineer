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

     
     let existingCalculation = await Calculation.findOne({ number1, number2, status: 'pending' });

     if (!existingCalculation) {
       // Cria o cálculo apenas se ele não existir
       const calculation = new Calculation({ number1, number2, status: "pending" });
       existingCalculation = await calculation.save();
       console.log("Novo cálculo criado com sucesso:");
     } else {
       console.warn("Cálculo já existe com os mesmos parâmetros.");
       res.status(400).json({ error: 'Cálculo já existe com os mesmos parâmetros.' });
       return;
     }
 
     res.status(201).json(existingCalculation);
     console.log("Enviando para a fila...");
     await RabbitMQService.sendToQueue('calculationQueue', existingCalculation);

  } catch (error) {
    console.error('Erro ao criar cálculo:', error);
    res.status(500).json({ error: 'Erro ao criar cálculo', details: error });
  }
};


export const getAllCalculations = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Recebendo requisição para buscar todos os cálculos.");
    const calculations = await Calculation.find(); // Busca todos os cálculos
    console.log("Cálculos encontrados:", calculations.length);
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

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    if (!id) {
      console.warn("ID não foi fornecido na requisição.");
      res.status(400).json({ error: 'ID não foi fornecido.' });
      return;
    }

  
    const updateData: Partial<ICalculation> = req.body;
    console.log("Dados para atualizar:", updateData);

    const updatedCalculation = await Calculation.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!updatedCalculation) {
      console.warn(`Cálculo com ID ${id} não encontrado para atualização.`);
      res.status(404).json({ error: 'Cálculo não encontrado' });
      return;
    }

    console.log("Cálculo atualizado com sucesso:", updatedCalculation);
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
      console.warn(`Cálculo com ID ${id} não encontrado para deleção.`);
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
