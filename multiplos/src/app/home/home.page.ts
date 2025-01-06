import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonCard, IonCardContent, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { ValueColor } from '../interfaces/color-value.interface';
import { Result } from '../interfaces/result.interface';
import { Multiple } from '../interfaces/multiple.interface';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonInput, IonButton, IonCard, IonCardContent, FormsModule, CommonModule, IonCol, IonGrid, IonRow],
})
export class HomePage {
  // Divisores predefinidos con su color asociado
  divisors: { [key: number]: string } = {
    3: 'green',
    5: 'red',
    7: 'blue',
  };

  enteredNumber: number = 0;
  list: ValueColor[] = [];
  message: string = '';

  // Mapa para almacenar los múltiplos por divisor
  private multiplesMap: { [key: number]: number[] } = {};

  constructor(private firestoreService: FirestoreService) {}

  //Verifica que el valor ingresado es un número entero
  isInteger(value: any): boolean {
    return Number.isInteger(Number(value));
  }
  

  // Función que genera los números y los cálculos correspondientes
  async showNumbers(): Promise<void> {
    const result: Result = this.generateElementsAndCalculate(this.enteredNumber);
    // Guarda el resultado en Firestore
    this.message = await this.firestoreService.addItem('records', result);
  }

  // Función para reiniciar los valores
  deleteNumbers(): void {
    this.enteredNumber = 0;
    this.list = [];
    this.message = '';
    this.multiplesMap = {}; 
  }

  // Genera los elementos (números y colores) hasta el límite
  private generateElementsAndCalculate(limit: number): Result {
    const elements: ValueColor[] = [];
    this.multiplesMap = {}; 

    for (let i = 0; i <= limit; i++) {
      this.addMultiples(i); 
      const color = this.getColorByPriority(i); 
      elements.push({ value: i, color });
    }

    this.list = elements; // Asigna la lista de elementos
    return this.createResult(limit, elements); 
  }

// Registra múltiplos de los divisores en multiplesMap
private addMultiples(num: number): void {
  for (const divisorNumber in this.divisors) {
    const divisor = Number(divisorNumber);

    if (num % divisor === 0 && num !== 0) {
      if (!this.multiplesMap[divisor]) {
        this.multiplesMap[divisor] = []; // Si el divisor no tiene un arreglo, lo crea
      }
      this.multiplesMap[divisor].push(num); // Agrega el número al divisor correspondiente
    }
  }
}

// Devuelve el color según el divisor del número
private getColorByPriority(num: number): string {
  if (num === 0) return 'black'; // Color negro para el número 0

  // Recorre los divisores para encontrar el primero divisible
  for (const divisor in this.divisors) {
    if (num % Number(divisor) === 0) {
      return this.divisors[Number(divisor)];
    }
  }

  return 'black'; // Si no es divisible, devuelve negro
}

/*Objeto que se va guardar en la base de datos.
  Crea el resultado final con los múltiplos y los elementos. */

  private createResult(limit: number, elements: ValueColor[]): Result {
    const multiplesArr: Multiple[] = [];
    console.log(new Date())
    for (const divisorNumber in this.multiplesMap) {
      multiplesArr.push({
        divisor: Number(divisorNumber),
        values: this.multiplesMap[divisorNumber],
      });
    }

    return {
      number: limit,
      numbers: elements.map((el) => el.value),
      multiples: multiplesArr,
      timestamp: new Date(),
    };
  }
}
