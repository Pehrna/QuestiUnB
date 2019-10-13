import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component( {
	selector: 'app-turma-login',
	templateUrl: './turma-login.page.html',
	styleUrls: ['./turma-login.page.scss'],
} )
export class TurmaLoginPage implements OnInit {

	pass;
	senha;
	//pass: string;
	//senha: string;

	constructor(
		private navP: NavParams,
		private popctrl: PopoverController

	) { }



	ngOnInit() {
		
		this.pass = this.navP.data.password;
		
	}

	async closeModal() {
		if ( this.senha == this.pass ) {

			await this.popctrl.dismiss( true );
		} else {
			await this.popctrl.dismiss( false );
		}
	}
}



