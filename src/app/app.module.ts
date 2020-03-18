import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './Components/Primary/login/login.component';
import { RegisterComponent } from './Components/Primary/register/register.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {FormsModule} from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {FieldComponent} from './Components/Secondary/field/field.component';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { ChatComponent } from './Components/Primary/chat/chat.component';

const routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'chat', component: ChatComponent},
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**',   redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FieldComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
