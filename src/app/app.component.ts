import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './core/services/auth.service';



@Component( {
	selector: 'app-root',
	templateUrl: 'app.component.html'
} )
export class AppComponent {

	pages: { url: string, directions: string, icon: string, text: string }[];
	user: firebase.User;

	constructor(
		private authService: AuthService,
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar
	) {
		this.initializeApp();
	}

	initializeApp() {

		this.pages = [
			//{ url: '/tasks', directions: 'back', icon: 'checkmark', text: 'Tasks' },
			{ url: '/turmas', directions: 'forward', icon: 'bookmarks', text: 'Turmas' },
			{ url: '/minhasturmas', directions: 'forward', icon: 'bookmarks', text: 'Minhas turmas' }
		];

		this.authService.authState$.subscribe( user => ( this.user = user ) );

		this.platform.ready().then( () => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		} );
	}
}
