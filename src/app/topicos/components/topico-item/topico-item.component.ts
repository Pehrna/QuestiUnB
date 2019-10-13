import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Topico } from '../../models/topico.model';
import { Dado } from 'src/app/auth/pages/auth.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginService } from 'src/app/core/services/service.service';

@Component( {
	selector: 'app-topico-item',
	//template: '<button (click)="sendMessage()">Send Message</button>',
	templateUrl: './topico-item.component.html',
	styleUrls: ['./topico-item.component.scss'],
} )
export class TopicoItemComponent {

	user: firebase.User;
	usuario: Dado = { ...this.usuario, professor: false };
	usuario$: Observable<Dado>;
	tamanho: number = 0;
	divDisable: boolean = false;
	agora: Date = new Date();

	constructor( private authService: AuthService, private serviceService: LoginService ) { }

	@Input() topico: Topico;
	@Output() done = new EventEmitter<Topico>();
	@Output() update = new EventEmitter<Topico>();
	@Output() delete = new EventEmitter<Topico>();
	@Output() select = new EventEmitter<Topico>();


	async ngOnInit() {

		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );
		this.usuario$ = this.serviceService.get( this.user.uid );
		await this.usuario$.subscribe( usu => {
			this.usuario = usu;
		} );

		var c = JSON.stringify( this.topico.data_fim );
		var year = parseInt( c.substring( 1, 5 ) );
		var month = parseInt( c.substring( 6, 8 ) );
		var day = parseInt( c.substring( 9, 11 ) );



		var d = new Date();
		var yearHJ = d.getUTCFullYear();
		var monthHJ = d.getUTCMonth() + 1;
		var dayHJ = d.getUTCDate();

		//console.log( "Nome: ", this.topico.title );
		if ( year < yearHJ ) {
			//console.log( "Ano maior entra aqui" );
			//Chama função pra esse topico
		} else {
			//console.log( "Ano menor/igual, vai testar mês" );
			if ( month < monthHJ ) {
				//console.log( "Mês maior entra aqui" );
				//Chama função pra esse topico
			} else {
				//console.log( "Mês menor/igual, vai testar o dia" );
				if ( day < dayHJ ) {
					//console.log( "Dia maior entra aqui" );
					//Chama função pra esse topico
				} else {
					//console.log( "Dia menor/igual, va passar reto" );
				}
			}
		}



	}
}
