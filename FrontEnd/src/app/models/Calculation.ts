export default interface Calculation {
  readonly _id: string; // O ID gerado automaticamente pelo MongoDB
  number1: number;
  number2: number;
  result?: number;
  status?: 'pending' | 'error' | 'done'; // Agora `status` é opcional
}

export class CalculationModel implements Calculation {
  constructor(
    public readonly _id: string,
    public number1: number,
    public number2: number,
    public result?: number, // Parâmetro opcional
    public status?: 'pending' | 'error' | 'done' // Parâmetro opcional
  ) {}

  // Getter para retornar `_id` como `id`
  get id(): string {
    return this._id;
  }
}
