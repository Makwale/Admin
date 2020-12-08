import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFrAuth: AngularFireAuth) { }

  async logingWithEmailAndPassword(email, password){
		return this.angularFrAuth.signInWithEmailAndPassword ( email, password);
}
}
