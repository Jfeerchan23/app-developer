import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonList, IonText, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
export interface element {
  color: string;  // El color en formato hexadecimal, RGB, o nombre del color
  value: number;  // El valor asociado al color
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonInput, IonInput, IonButton, IonCard, IonCardContent, FormsModule, CommonModule, IonCol, IonGrid, IonRow],
})

export class HomePage {

  num: number = 0; // Propiedad para almacenar el número ingresado
  list: element[] = [];

  constructor() {}

  showNumbers(){
  this.list = [];
    for (let i = 0; i <= this.num; i++) {
      this.list.push({ color: this.getColor(i), value: i })
    }
  }

  getColor(num: number): string {
    const colorMap: { [key: number]: string } = {
      3: 'green',  // Múltiplo de 3
      5: 'red',    // Múltiplo de 5
      7: 'blue'    // Múltiplo de 7
    };
  
    // Si el número es 0, se devuelve negro
    if (num === 0) {
      return 'black';
    }
  
    // Recorremos los múltiplos posibles (3, 5, 7)
    for (let divisor of [3, 5, 7]) {
      if (num % divisor === 0) {
        return colorMap[divisor];  // Devolvemos el color correspondiente
      }
    }
  
    // Si no es múltiplo de 3, 5 ni 7, devolvemos negro
    return 'black';
  }
  
}
