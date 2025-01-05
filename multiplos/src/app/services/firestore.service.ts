import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Result } from '../interfaces/result.interface';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  async addItem(collectionName: string, result: Result): Promise<string> {
    try {
      await this.firestore.collection(collectionName).add(result);
      return 'Registro guardado correctamente.';
    } catch (error) {
      console.error('Error al guardar el registro:', error);
      return 'Error al guardar el registro.';
    }
  }
  
}
