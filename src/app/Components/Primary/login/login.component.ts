import {Component, NgZone, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';
  pass = '';
  disabled = false;

  error = false;

  constructor(private aut: AngularFireAuth,
              private router: Router,
              private ngZone: NgZone) {
    this.aut.auth.onAuthStateChanged(user => {
      if (user) {
        this.ngZone.run(() => this.router.navigate(['/chat']));
      }
    });
  }

  ngOnInit() {
  }

  login() {
    this.error = false;
    this.disabled = true;
    setTimeout(() => {
      this.aut.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          return firebase.auth().signInWithEmailAndPassword(this.email, this.pass);
        })
        .then(() => {
          this.email = this.pass = '';
        })
        .catch(() => {
          this.error = true;
        }).finally(() => {
          this.disabled = false;
        });
    }, 500);
  }

}
