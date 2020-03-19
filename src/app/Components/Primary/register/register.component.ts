import {Component, NgZone, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formData = {
    name: '',
    email: '',
    password: '',
    confPassword: ''
  };
  state = {
    name: '',
    email: '',
    password: '',
    confPassword: ''
  };

  error = '';
  success = false;
  disabled = false;

  constructor(private aut: AngularFireAuth,
              private db: AngularFirestore,
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

  register() {
    this.disabled = true;
    setTimeout(() => {
      const stateArray = [this.state.name, this.state.email, this.state.password, this.state.confPassword];
      this.error = '';
      for (const states of stateArray) {
        if (states) {
          this.error = states;
          break;
        }
      }
      if (!this.error) {
        this.aut.auth.createUserWithEmailAndPassword(this.formData.email, this.formData.password)
          .then((user) => {
            user.user.updateProfile({
              displayName: this.formData.name
            });
            this.router.navigate(['/login']);
          })
          .catch(reason => {
            this.error = reason.message;
          })
          .finally(() => {
            this.disabled = false;
          });
      } else {
        this.disabled = false;
      }
    }, 500);

  }

  resetField() {
    this.formData = {
      name: '',
      email: '',
      password: '',
      confPassword: ''
    };
  }

}
