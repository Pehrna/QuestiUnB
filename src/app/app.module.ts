import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { TurmaLoginPageModule } from './turmas/pages/turma-login/turma-login.module';


@NgModule( {
	declarations: [
		AppComponent
	],
	imports: [
		CoreModule,
		AppRoutingModule,
		BrowserModule,
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		TurmaLoginPageModule,

	],
	bootstrap: [
		AppComponent
	]
} )
export class AppModule { }

export const firebaseConfig = {
	apiKey: "AIzaSyAMa5-hXecPsBuYfrPT15nXZfik5xn1_d8",
	authDomain: "ionic-firestore-viniraquel.firebaseapp.com",
	databaseURL: "https://ionic-firestore-viniraquel.firebaseio.com",
	projectId: "ionic-firestore-viniraquel",
	storageBucket: "ionic-firestore-viniraquel.appspot.com",
	messagingSenderId: "763041844153",
	appId: "1:763041844153:web:73da376d8a9918c0"
};
