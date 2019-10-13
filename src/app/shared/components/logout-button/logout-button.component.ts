import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavController, MenuController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';


@Component( {
	selector: 'app-logout-button',
	template: '<ion-buttons><ion-button (click)="logout()"><ion-icon name="exit" slot="icon-only"></ion-icon></ion-button></ion-buttons>'
} )

export class LogoutButtonComponent implements OnInit {

	@Input() menu: string;


	constructor(
		private authService: AuthService,
		private navCtrl: NavController,
		private overlayService: OverlayService,
		private menuCtrl: MenuController ) { }

	async ngOnInit(): Promise<void> {
		if ( !( await this.menuCtrl.isEnabled( this.menu ) ) ) {
			this.menuCtrl.enable( true, this.menu );
		}
	}

	alertFunc() {
		console.log( "Saindo!" );
	}

	async logout(): Promise<void> {
		await this.overlayService.alert( {
			message: 'Quer realmente sair?',
			buttons: [
				{
					text: 'Sim',
					handler: async () => {		
						await this.menuCtrl.enable( false, this.menu );
						this.navCtrl.navigateRoot( '/login' );		
						await this.authService.logout();
						//await this.authService.unsubscribe();
					}
				},
				'No'
			]
		} )
	}

}
