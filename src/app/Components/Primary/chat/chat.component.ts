import {Component, NgZone, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  loggedInUser: firebase.User = null;

  constructor(private aut: AngularFireAuth,
              private router: Router,
              private ngZone: NgZone) {
    this.aut.auth.onAuthStateChanged(user => {
      if (user) {
        this.loggedInUser = user;
        this.ngZone.run(() => this.router.navigate(['/chat']));
      }
    });
  }

  ngOnInit() {
  }

}
