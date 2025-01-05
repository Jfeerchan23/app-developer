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
  // Configuración flexible para los divisores y sus colores
  divisors: { [key: number]: string } = {
    3: 'green',
    5: 'red',
    7: 'blue',
  };

  num: number = 0;           // Número ingresado por el usuario
  list: ValueColor[] = [];   // Lista de elementos con colores calculados
  message: String = '';      // Mensaje de éxito o error al guardar un registro

  constructor(private firestoreService: FirestoreService) {}

  // Método principal para mostrar los números y calcular los múltiplos
  async showNumbers(): Promise<void> {
    const result: Result = this.generateElementsAndCalculate(this.num);
    console.log(result)
    this.message = await this.firestoreService.addItem('records', result);
  }

  // Método para borrar los números y limpiar el estado
  deleteNumbers(): void {
    this.num = 0;           // Reiniciar el número
    this.list = [];         // Limpiar la lista de elementos
    this.message = '';      // Limpiar el mensaje
  }

  private generateElementsAndCalculate(limit: number): Result {
    const elements: ValueColor[] = [];  // Lista para almacenar los elementos con colores
    const multiples: Multiple[] = [];   // Usamos un array de objetos para los múltiplos
    
    // Itera desde 0 hasta el límite ingresado para clasificar los números
    for (let i = 0; i <= limit; i++) {
      this.addMultiples(i, multiples); // Agregar los múltiplos para cada número
      const color = this.getColorByPriority(i); // Obtener el color del número
      elements.push({ value: i, color });  // Agregar el número y su color a la lista
    }
  
    this.list = elements;  // Asignar la lista de elementos generados
    // Crear y devolver el resultado final con los números y sus múltiplos
    return this.createResult(limit, elements, multiples);
  }

  private addMultiples(num: number, multiples: Multiple[]): void {
    // Itera sobre cada divisor para ver si el número es divisible por él
    Object.keys(this.divisors).forEach((divisor) => {
      const divisorNumber = parseInt(divisor);  // Convertir la clave a número
      if (num % divisorNumber === 0 && num !== 0) {  // Verificar si es múltiplo
        // Busca si ya existe un objeto para este divisor en el array 'multiples'
        let divisorEntry = multiples.find(entry => entry.divisor === divisorNumber);
        
        // Si no existe, creamos un nuevo objeto para este divisor
        if (!divisorEntry) {
          divisorEntry = { divisor: divisorNumber, values: [] };
          multiples.push(divisorEntry);  // Añadirlo al array de múltiplos
        }
        
        divisorEntry.values.push(num);  // Agregar el número a los múltiplos
      }
    });
  }

  // Método para determinar el color basado en la prioridad de divisores
  private getColorByPriority(num: number): string {
    if (num === 0) return 'black';  // Si es cero, el color es negro

    // Itera sobre los divisores y devuelve el color del primer divisor que divide al número
    for (const divisor in this.divisors) {
      if (num % parseInt(divisor) === 0) {
        return this.divisors[divisor];  // Retorna el color asociado al divisor
      }
    }

    return 'black';  // Si no es múltiplo de ningún divisor, el color es negro
  }
  
  private createResult(limit: number, elements: ValueColor[], multiples: Multiple[]): Result {
    // Crear un array que contendrá los divisores con sus respectivos múltiplos
    const multiplesArr: { divisor: number, values: number[] }[] = [];
  
    // Iterar sobre los divisores y agregar sus múltiplos en el formato deseado
    Object.keys(this.divisors).forEach((divisor) => {
      const divisorNumber = parseInt(divisor);
      const divisorEntry = multiples.find(entry => entry.divisor === divisorNumber);
  
      if (divisorEntry) {
        multiplesArr.push({ divisor: divisorEntry.divisor, values: divisorEntry.values });
      }
    });
  
    return {
      number: limit,
      numbers: elements.map((el) => el.value),
      multiples: multiplesArr,  // Aquí asignamos el array de múltiplos con el formato adecuado
      timestamp: new Date(),
    };
  }
  
  
}
