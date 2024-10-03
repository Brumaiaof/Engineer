export default interface Calculation {
  readonly _id: string; 
  number1: number;
  number2: number;
  result?: number;
  status?: 'pending' | 'error' | 'done'; 
}

export class CalculationModel implements Calculation {
  constructor(
    public readonly _id: string,
    public number1: number,
    public number2: number,
    public result?: number, 
    public status?: 'pending' | 'error' | 'done' 
  ) {}

  /// para retornar `_id` como `id`
  get id(): string {
    return this._id;
  }
}
