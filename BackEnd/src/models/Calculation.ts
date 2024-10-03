import mongoose, { Document, Schema, Model } from 'mongoose';


export interface ICalculation extends Document {
                               
  number1: number;
  number2: number;
  result?: number;
  status: 'pending' | 'error' | 'done';              // Status específico
}


const CalculationSchema: Schema = new Schema(
  {
    number1: {
      type: Number,
      required: true,
    },
    number2: {
      type: Number,
      required: true,
    },
    result: {
      type: Number,
      required: false,     
    },
    status: {
      type: String,
      enum: ['pending', 'error', 'done'],    // Valores permitidos
      required: true,
      default: 'pending', 
    },
  },
  {
    timestamps: true, 
  }
);


const Calculation: Model<ICalculation> = mongoose.model<ICalculation>('Calculation', CalculationSchema);
export default Calculation;
