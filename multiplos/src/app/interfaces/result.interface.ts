export interface Result {
  number: number; // El número ingresado por el usuario
  numbers: number[]; // Todos los números hasta el ingresado
  multiples: { [key: number]: number[] }; // Múltiplos por divisor
  timestamp: Date; // Fecha y hora en que se generó el resultado
}
