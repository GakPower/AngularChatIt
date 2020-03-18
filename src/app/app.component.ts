import {AfterViewInit, Component, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public aut: AngularFireAuth,
              private router: Router,
              private ngZone: NgZone) {
    this.aut.auth.onAuthStateChanged(user => {
      if (user) {
        this.ngZone.run(() => this.router.navigate(['/chat']));
      }
    });
  }

  logout() {
    this.aut.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }
}
