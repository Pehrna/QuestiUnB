import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Topico } from '../../models/topico.model';
import { Dado } from 'src/app/auth/pages/auth.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginService } from 'src/app/core/services/service.service';
import { TurmasService } from 'src/app/turmas/services/turmas.service';
import { Turma } from 'src/app/turmas/Models/Turmas.models';
import { TopicosService } from '../../services/topicos.service';
import { OverlayService } from 'src/app/core/services/overlay.service';

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
	id_turma: string;
	turma: Turma;


	constructor(
		private authService: AuthService,
		private serviceService: LoginService,
		private turmaService: TurmasService,
		private topicoService: TopicosService,
		private overlayService: OverlayService
	) { }

	@Input() topico: Topico;
	@Output() done = new EventEmitter<Topico>();
	@Output() update = new EventEmitter<Topico>();
	@Output() delete = new EventEmitter<Topico>();
	@Output() select = new EventEmitter<Topico>();


	async ngOnInit() {
		const loading = await this.overlayService.loading( {} );

		try {

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

			const turma2 = await this.turmaService.getTurma( this.topico.id_turma );



			//console.log( "Nome: ", this.topico.title );
			if ( year < yearHJ ) {
				//console.log( "Ano maior entra aqui" );
				//Chama função pra esse topico
				await turma2.subscribe( turm => {
					this.turma = turm;
					//console.log( "Ano maior: ", this.turma );
					this.restituicao( this.turma );
				} );
			} else {
				//console.log( "Ano menor/igual, vai testar mês" );
				if ( month < monthHJ && year == yearHJ ) {
					//console.log( "Mês maior entra aqui" );
					//Chama função pra esse topico
					await turma2.subscribe( turm => {
						this.turma = turm;
						//console.log( "Mes maior: ", this.turma );
						this.restituicao( this.turma );
					} );
				} else {
					//console.log( "Mês menor/igual, vai testar o dia" );
					if ( day < dayHJ && month == monthHJ ) {
						//console.log( "Dia maior entra aqui" );
						//Chama função pra esse topico
						await turma2.subscribe( turm => {
							this.turma = turm;
							//console.log( "Dia maior: ", this.turma );
							this.restituicao( this.turma );
						} );
					} else {
						//console.log( "Dia menor/igual, vai passar reto" );
					}
				}
			}
		} catch ( error ) {
			console.log( error );
		} finally {
			loading.dismiss();
		}
	}
	async restituicao( turma: Turma ) {

		if ( !this.topico.encerrado ) {
			this.topico.encerrado = true;
			this.topicoService.update( this.topico );

			try {

				for ( var i = 0; i < turma.lista.length; i++ ) {	

					const moeda = turma.lista[i].moedas + 2;
					turma.lista[i].moedas = moeda;
					
				}
				this.turmaService.updateTurma( turma );
			} catch ( error ) {
				console.log( error );
			}
		} else {
			//console.log( "Ja tava encerrado!" );
		}

	}
}