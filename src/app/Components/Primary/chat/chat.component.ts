import {Component, NgZone, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  loggedInUser: firebase.User = null;

  message = '';
  messages = [];

  constructor(private aut: AngularFireAuth,
              private router: Router,
              private ngZone: NgZone,
              private db: AngularFirestore) {
    this.aut.auth.onAuthStateChanged(user => {
      if (user) {
        this.loggedInUser = user;
        this.loadMessages();
      }
    });
  }

  loadMessages() {
    this.db.firestore.collection('messages')
      .orderBy('time', 'asc')
      .onSnapshot(docs => {
        this.messages = [];
        docs.forEach(result => {
          this.ngZone.run(() => {
            this.messages.push(result.data());
          });
        });
      });
  }

  sendMessage() {
    if (this.message) {
      const data = {
        message: this.message,
        sender: this.loggedInUser.displayName,
        time: new Date()
      };
      this.messages.push(data);
      this.message = '';

      this.db.firestore.collection('messages').add(
        data
      );
    }
  }

  scrollToTheBottom(divElement) {
    divElement.scrollTop = divElement.scrollHeight;
  }

  ngOnInit() {
  }
}
