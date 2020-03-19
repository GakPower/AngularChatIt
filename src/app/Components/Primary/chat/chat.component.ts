import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesDiv', {static: false}) messagesDiv: any;

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
        this.scrollToTheBottom();
      });
  }

  sendMessage() {
    if (this.message) {
      const data = {
        message: this.message,
        sender: this.loggedInUser.displayName,
        time: new Date(),
        showSender: this.messages.length > 0 && (this.loggedInUser.displayName === this.messages[this.messages.length - 1].sender)
      };
      this.messages.push(data);
      this.message = '';

      this.db.firestore.collection('messages').add(
        data
      );
    }
  }

  scrollToTheBottom() {
    this.messagesDiv.nativeElement.scrollTop = this.messagesDiv.nativeElement.scrollHeight;
  }

  ngOnInit() {
  }
}
