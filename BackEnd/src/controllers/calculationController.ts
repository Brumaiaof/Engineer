import { Request, Response } from 'express';
import * as CalculationService from '../services/calculationService'; // importa as funções criadas na pasta services
import mongoose from 'mongoose';

// Funções controladoras
export const createCalculation = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Recebendo requisição de criação com body:", JSON.stringify(req.body, null, 2));
    const { number1, number2 } = req.body;

    if (number1 == null || number2 == null) {
      console.warn("Parâmetros faltando: number1 ou number2 não foram fornecidos.");
      res.status(400).json({ error: 'Parâmetros faltando: number1 ou number2 não foram fornecidos.' });
      return;
    }

    const newCalculation = await CalculationService.createCalculation(number1, number2);
    console.log("Novo cálculo criado com sucesso:", newCalculation);

    res.status(201).json(newCalculation);
  } catch (error) {
    console.error('Erro ao criar cálculo:', error);
    res.status(500).json({ error: 'Erro ao criar cálculo', details:  error });
  }
};

export const getAllCalculations = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Recebendo requisição para buscar todos os cálculos.");
    const calculations = await CalculationService.getAllCalculations();

    


    
    console.log("Cálculos encontrados:", calculations.length);
    res.json(calculations);
  } catch (error) {
    console.error('Erro ao buscar cálculos:', error);
    res.status(500).json({ error: 'Erro ao buscar cálculos', details:  error });
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

    const updateData = req.body;
    console.log("Dados para atualizar:", updateData);

    const updatedCalculation = await CalculationService.updateCalculation(id, updateData);
    if (!updatedCalculation) {
      console.warn(`Cálculo com ID ${id} não encontrado para atualização.`);
      res.status(404).json({ error: 'Cálculo não encontrado' });
      return;
    }

    console.log("Cálculo atualizado com sucesso:", updatedCalculation);
    res.json({ success: 'Cálculo atualizado com sucesso', updatedCalculation });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    res.status(500).json({ error: 'Erro ao atualizar cálculo', details:  error });
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

    const deletedCalculation = await CalculationService.deleteCalculation(id);
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
