import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthService, 
    private router: Router,private afs: AngularFirestore) { }

  ngOnInit() {
  }

  logingWithEmailAndPassword(username: string, password: string){
  	this.authService.logingWithEmailAndPassword(username, password).then( userCredential => {
      	this.router.navigateByUrl("home");
        
     	 }).catch(error => {
      		alert(error.message);
    	})
  }


}
