import Calculation, { ICalculation } from "../models/Calculation";
import mongoose from 'mongoose';

//criar funcao de calculo

export const createCalculation = async (
  number1: number,
  number2: number
): Promise<ICalculation> => {
  try {

    if (number1 == null || number2 == null) {
      throw new Error("Parâmetros faltando: number1 ou number2 não foram fornecidos.");
    };

    const existingCalculation = await Calculation.findOne({ number1, number2, status: 'pending' });
    if (existingCalculation) {
      
      throw ("Cálculo já existe com os mesmos parâmetros.");
    }

    const calculation = new Calculation({
      number1,
      number2,
      status: "pending",
    });

    return calculation.save(); // Salva no MongoDB
  } catch (error) {
    console.error(`Ocorreu um erro no Create Calculation: ERRO: [${error}]`);
    throw new Error("Não foi possível criar o cálculo.");
  }
}

export const getAllCalculations = async (): Promise<ICalculation[]> => {
  try {
    return await Calculation.find();
  } catch (error) {
    console.error(`Ocorreu um erro no Get Calculation: ERRO: [${error}]`);
    throw new Error("Não foi possível visualizar os calculos.");
  }
};

export const updateCalculation = async (
  id: string,
  updateData: Partial<ICalculation>
): Promise<ICalculation | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    const updatedCalculation = await Calculation.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Retorna o documento atualizado
    );

    return updatedCalculation;

  } catch (error) {
    console.error(`Ocorreu um erro no Update Calculation: ERRO: [${error}]`);
    throw new Error("Não foi possível atualizar o cálculo.");
  }
};

export const deleteCalculation = async (
  id: string
): Promise<ICalculation | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    return await Calculation.findByIdAndDelete(id);
  } catch (error) {
    console.error(`Ocorreu um erro no Delete Calculation: ERRO: [${error}]`);
    throw new Error("Não foi possível deletar o cálculo.");
  }
};

//module.exports(createCalculation, getAllCalculations, updateCalculation, deleteCalculation);
