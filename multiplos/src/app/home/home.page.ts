import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonCard, IonCardContent, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
export interface element {
  color: string;  // El color en formato hexadecimal, RGB, o nombre del color
  value: number;  // El valor asociado al color
}
export interface Result {
  number: number; // El número ingresado por el usuario
  numbers: number[]; // Todos los números hasta el ingresado
  multiples: {
    multipleOf3: number[];  // Múltiplos de 3
    multipleOf5: number[];  // Múltiplos de 5
    multipleOf7: number[];  // Múltiplos de 7
  };
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonInput, IonInput, IonButton, IonCard, IonCardContent, FormsModule, CommonModule, IonCol, IonGrid, IonRow],
})

export class HomePage {
  static readonly DIVISORS = [3, 5, 7];
  static readonly COLORS = { 3: 'green', 5: 'red', 7: 'blue' };

  num: number = 0;           // Número ingresado por el usuario
  list: element[] = [];      // Lista de elementos con colores

  constructor() {}

  showNumbers(): void {
    const result: Result = this.generateElementsAndCalculate(this.num);
    console.log(result); // Resultado final para Firebase u otras operaciones
  }

  private generateElementsAndCalculate(limit: number): Result {
    const elements: element[] = [];
    const multiples: { [key: number]: number[] } = { 3: [], 5: [], 7: [] };
  
    for (let i = 0; i <= limit; i++) {
      // Agregar el número a sus respectivos múltiplos
      this.addMultiples(i, multiples);
  
      // Determinar el color basado en la prioridad de divisores
      const color = this.getColorByPriority(i);
      elements.push({ value: i, color });
    }
  
    this.list = elements;
  
    return {
      number: limit,
      numbers: elements.map((el) => el.value),
      multiples: {
        multipleOf3: multiples[3],
        multipleOf5: multiples[5],
        multipleOf7: multiples[7],
      },
    };
  }
  
  // Agrega el número a las listas de múltiplos correspondientes
  private addMultiples(num: number, multiples: { [key: number]: number[] }): void {
    for (const divisor of HomePage.DIVISORS) {
      if (num % divisor === 0 && num !== 0) {
        multiples[divisor].push(num);
      }
    }
  }
  
  // Determina el color basado en la prioridad de divisores (más bajo primero)
  private getColorByPriority(num: number): string {
    if (num === 0) return 'black';
  
    const colorMap: { [key: number]: string } = HomePage.COLORS;
  
    for (const divisor of HomePage.DIVISORS) {
      if (num % divisor === 0) {
        return colorMap[divisor]; // Retorna el color del divisor más pequeño
      }
    }
  
    return 'black'; // Si no es múltiplo de ninguno, el color es negro
  }
  
}  