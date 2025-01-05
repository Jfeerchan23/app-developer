export interface Result {
  number: number;
  numbers: number[];
  multiples: { divisor: number, values: number[] }[];  // Cambia la definición aquí
  timestamp: Date;
}
