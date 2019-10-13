import { NgModule } from '@angular/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { environment } from 'src/environments/environment';

@NgModule( {
	imports: [
		IonicModule.forRoot(),
		AngularFireModule.initializeApp( environment.firebase ),
		AngularFireAuthModule,
		AngularFirestoreModule.enablePersistence( {
			experimentalTabSynchronization: true
		} )
	],
	exports: [
		BrowserModule,
		IonicModule
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
	]
} )
export class CoreModule { }
