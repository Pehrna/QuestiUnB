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
	topicos$: Observable<Topico[]>;
	topicos: Topico[];
	tamanho: number = 0;
	divDisable: boolean = false;
	agora: Date = new Date();
	id_turma: string;
	turma: Turma;
	falta_avaliar: boolean = true;
	falta_pergunta: boolean = true;
	quantas_falta: number = 0;


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


		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );
		this.usuario$ = this.serviceService.get( this.user.uid );
		await this.usuario$.subscribe( usu => {
			this.usuario = usu;
		} );
		this.topicos$ = this.topicoService.getAll();
		await this.topicos$.subscribe( topics => {
			this.topicos = topics;
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
			//Chama fun��o pra esse topico
			await turma2.subscribe( turm => {
				this.turma = turm;
				this.sera_que_falta( this.turma, this.topico );

				//console.log( "Ano maior: ", this.turma );
				this.restituicao( this.turma );
			} );
		} else {
			//console.log( "Ano menor/igual, vai testar m�s" );
			if ( month < monthHJ && year == yearHJ ) {
				//console.log( "M�s maior entra aqui" );
				//Chama fun��o pra esse topico
				await turma2.subscribe( turm => {
					this.turma = turm;
					this.sera_que_falta( this.turma, this.topico );

					//console.log( "Mes maior: ", this.turma );
					this.restituicao( this.turma );
				} );
			} else {
				//console.log( "M�s menor/igual, vai testar o dia" );
				if ( day < dayHJ && month == monthHJ ) {
					//console.log( "Dia maior entra aqui" );
					//Chama fun��o pra esse topico
					await turma2.subscribe( turm => {
						this.turma = turm;
						this.sera_que_falta( this.turma, this.topico );

						//console.log( "Dia maior: ", this.turma );
						this.restituicao( this.turma );
					} );
				} else {
					//console.log( "Dia menor/igual, vai passar reto" );
					await turma2.subscribe( turm => {
						this.turma = turm;
						this.sera_que_falta( this.turma, this.topico );
						//console.log( "Dia maior: ", this.turma );
					} );
				}
			}
		}

		//for ( var i = 0; i < this.turma.lista.length; i++ ) {
		//	if ( this.user.uid == this.turma.lista[i].id_aluno ) {
		//		for ( var j = 0; this.turma.lista[i].lista_topico.length; j++ ) {
		//			if ( this.topico.title == this.turma.lista[i].lista_topico[j].nome_topico ) {
		//				if ( this.turma.lista[i].lista_topico[j].qtd_questoes < this.turma.lista[i].lista_topico[j].qtd_esperada ) {
		//					this.falta_pergunta = true;
		//					this.quantas_falta = +this.turma.lista[i].lista_topico[j].qtd_esperada - +this.turma.lista[i].lista_topico[j].qtd_questoes;
		//				} else {
		//					this.falta_pergunta = false;
		//				}
		//			}
		//		}
		//	}
		//}
	}

	async sera_que_falta( turma: Turma, topico: Topico ) {

		for ( var i = 0; i < turma.lista.length; i++ ) {
			if ( this.user.uid == turma.lista[i].id_aluno ) {
				for ( var j = 0; j < turma.lista[i].lista_topico.length; j++ ) {
					if ( topico.title == turma.lista[i].lista_topico[j].nome_topico ) {
						if ( turma.lista[i].lista_topico[j].qtd_questoes < turma.lista[i].lista_topico[j].qtd_esperada && !this.usuario.professor) {
							this.falta_pergunta = true;
							this.quantas_falta = +turma.lista[i].lista_topico[j].qtd_esperada - +turma.lista[i].lista_topico[j].qtd_questoes;
						} else {
							this.falta_pergunta = false;
						}
					}
				}
			}
		}

	}

	async restituicao( turma: Turma ) {
		var aux = 0;
		var somatorio = 0;
		var somatorio_compartilhador = 0;
		var somatorio_avaliador = 0;
		var peso_somado = 0;
		const loading = await this.overlayService.loading( {
			message: 'Carregando...'
		} );
		try {

			if ( !this.topico.encerrado ) {
				this.topico.encerrado = true;
				await this.topicoService.update( this.topico );
				this.topicos$ = this.topicoService.getAll();
				await this.topicos$.subscribe( topics => {
					this.topicos = topics;
				} );

				console.log( "Come�a aqui:" );
				console.log( "Come�a aqui:" );
				console.log( "Come�a aqui:" );
				console.log( "Come�a aqui:" );
				console.log( "Come�a aqui:" );

				for ( var i = 0; i < turma.lista.length; i++ ) {
					somatorio = 0;
					somatorio_avaliador = 0;
					somatorio_compartilhador = 0;
					aux = 0;
					peso_somado = 0;
					for ( var j = 0; j < turma.lista[i].lista_topico.length; j++ ) {
						for ( var k = 0; k < this.topicos.length; k++ ) {
							if ( this.topicos[k].title == turma.lista[i].lista_topico[j].nome_topico && this.topicos[k].encerrado ) {
								console.log( "Se o topico tem os mesmos nomes e ta encerrado: ", this.topicos[k].title );
								aux++;
								console.log( "Aux:", aux );
								peso_somado = +this.topicos[k].peso_avaliacao + +this.topicos[k].peso_pergunta;
								console.log( "Peso de compartilhador: ", this.topicos[k].peso_pergunta );
								console.log( "Peso de avaliador: ", this.topicos[k].peso_avaliacao );
								console.log( "Peso somado: ", peso_somado );
								console.log( "Nota avaliador: ", turma.lista[i].lista_topico[j].nota_avaliador, " multiplicado pelo peso: ", this.topicos[k].peso_avaliacao );
								console.log( "Nota compartilhador: ", turma.lista[i].lista_topico[j].nota_compartilhador, " multiplicado pelo peso: ", this.topicos[k].peso_pergunta );
								somatorio_avaliador = ( +turma.lista[i].lista_topico[j].nota_avaliador + +somatorio_avaliador );
								somatorio_compartilhador = ( turma.lista[i].lista_topico[j].nota_compartilhador + somatorio_compartilhador );
								somatorio = ( ( turma.lista[i].lista_topico[j].nota_avaliador * this.topicos[k].peso_avaliacao ) + ( turma.lista[i].lista_topico[j].nota_compartilhador * this.topicos[k].peso_pergunta ) ) / peso_somado + somatorio;
								console.log( "Somatorio: ", somatorio );

							}
						}
					}
					console.log( "Esse aluno recebera uma nota: ", turma.lista[i].id_aluno );
					turma.lista[i].nota = ( somatorio / aux ) * 10;
					turma.lista[i].reputacao_avaliador = ( somatorio_avaliador / aux );
					turma.lista[i].reputacao_compartilhador = ( somatorio_compartilhador / aux );
					console.log( "Essa nota: ", turma.lista[i].nota );
					const moeda = turma.lista[i].moedas + turma.lista[i].nota;
					turma.lista[i].moedas = moeda;
				}

				//const moeda = turma.lista[i].moedas + turma.lista[i].nota;
				//turma.lista[i].moedas = moeda;
				this.turmaService.updateTurma( turma );
			}

		} catch ( error ) {
			console.log( 'Erro ao restituir: ', error )
			await this.overlayService.toast( {
				message: error.message
			} );
		} finally {
			loading.dismiss();
		}

	}
}