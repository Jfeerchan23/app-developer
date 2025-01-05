import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonCard, IonCardContent, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ValueColor } from '../interfaces/color-value.interface';
import { Result } from '../interfaces/result.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonInput, IonButton, IonCard, IonCardContent, FormsModule, CommonModule, IonCol, IonGrid, IonRow],
})
export class HomePage {
  // Configuración flexible para los divisores y sus colores
  divisors: { [key: number]: string } = {
    3: 'green',
    5: 'red',
    7: 'blue',
  };

  num: number = 0;           // Número ingresado por el usuario
  list: ValueColor[] = [];      // Lista de elementos con colores

  constructor(private firestore: AngularFirestore) {}


  // Método principal para mostrar los números y calcular los múltiplos
  showNumbers(): void {
    const result: Result = this.generateElementsAndCalculate(this.num);
    console.log(result); // Resultado final para Firebase u otras operaciones
    this.firestore.collection('records').add(result);
  }

  deleteNumbers():void{
    this.num = 0;           // Número ingresado por el usuario
    this.list = [];
  }

  private generateElementsAndCalculate(limit: number): Result {
    const elements: ValueColor[] = [];
    // Asegúrate de que las claves sean números (no cadenas) y que los valores sean arrays de números
    const multiples: { [key: number]: number[] } = this.initializeMultiples();
  
    for (let i = 0; i <= limit; i++) {
      this.addMultiples(i, multiples); // Agregar los múltiplos para cada número
      const color = this.getColorByPriority(i); // Obtener color basado en la prioridad de divisores
      elements.push({ value: i, color });
    }
  
    this.list = elements;
    return this.createResult(limit, elements, multiples); // Crear el resultado final
  }
  

// Inicializa un objeto con las claves de los divisores
private initializeMultiples(): { [key: number]: number[] } {
  return Object.keys(this.divisors).reduce((acc, divisor) => {
    const divisorNumber = parseInt(divisor); // Convertir la clave a número
    acc[divisorNumber] = []; // Usar divisorNumber como índice
    return acc;
  }, {} as { [key: number]: number[] });
}


  private addMultiples(num: number, multiples: { [key: number]: number[] }): void {
    // Convertir divisor a número para evitar problemas de tipos
    Object.keys(this.divisors).forEach((divisor) => {
      const divisorNumber = parseInt(divisor); // Convertir la clave a número
      if (num % divisorNumber === 0 && num !== 0) {
        if (!multiples[divisorNumber]) {
          multiples[divisorNumber] = []; // Inicializar el array si no existe
        }
        multiples[divisorNumber].push(num);
      }
    });
  }
  

  // Determina el color basado en la prioridad de divisores (más bajo primero)
  private getColorByPriority(num: number): string {
    if (num === 0) return 'black';

    // Devuelve el color del divisor más pequeño que divide el número
    for (const divisor in this.divisors) {
      if (num % parseInt(divisor) === 0) {
        return this.divisors[divisor];
      }
    }

    return 'black'; // Si no es múltiplo de ninguno, el color es negro
  }

  // Genera el objeto final de resultado con los números y sus múltiplos
  private createResult(limit: number, elements: ValueColor[], multiples: { [key: number]: number[] }): Result {
    return {
      number: limit,
      numbers: elements.map((el) => el.value),
      multiples: multiples,
      timestamp: new Date()
    };
  }
}
