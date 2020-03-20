import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';

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
      .orderBy('time', 'desc')
      .onSnapshot(docs => {
      this.ngZone.run(() => {
        this.messages = [];
        const tempMessages = [];
        docs.forEach(result => {
          const data = result.data();
          const date = data.time.toDate();
          data.hour = this.getFormattedTime(date);
          data.date = data.showDateBanner ? this.getFormattedDate(date) : '';
          tempMessages.push(data);
          console.log(data);
        });
        this.messages = tempMessages.reverse();
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
        showSender: this.messages.length === 0 || this.messages.length > 0 &&
          (this.messages[this.messages.length - 1].sender !== this.loggedInUser.displayName),
        showDateBanner: this.messages.length === 0 || this.messages.length > 0 &&
          this.areDifferentDates(this.messages[this.messages.length - 1].time.toDate(), new Date())
      };
      this.message = '';

      this.db.firestore.collection('messages').add(
        data
      );
    }
  }

  scrollToTheBottom() {
    this.messagesDiv.nativeElement.scrollTop = this.messagesDiv.nativeElement.scrollHeight;
  }

  getFormattedTime(date: Date) {
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    let seconds: any = date.getSeconds();

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return hours + ':' + minutes + ':' + seconds;
  }
  getFormattedDate(date: Date) {
    let month: any = (date.getMonth() + 1);
    let day: any = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return date.getFullYear() + '/' + month + '/' + day;
  }

  areDifferentDates(dateOne: Date, dateTwo: Date) {
    const idDateOne = dateOne.getFullYear() + dateOne.getMonth() + dateOne.getDate();
    const idDateTwo = dateTwo.getFullYear() + dateTwo.getMonth() + dateTwo.getDate();
    return idDateOne !== idDateTwo;
  }

  ngOnInit() {
  }
}
