import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pergunta, Nota } from '../../models/pergunta.model';
import { PerguntasService } from '../../services/perguntas.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Dado } from 'src/app/auth/pages/auth.model';
import { LoginService } from 'src/app/core/services/service.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Turma } from 'src/app/turmas/Models/Turmas.models';
import { TurmasService } from 'src/app/turmas/services/turmas.service';

@Component( {
	selector: 'app-perguntas-list',
	templateUrl: './perguntas-list.page.html',
	styleUrls: ['./perguntas-list.page.scss'],
} )
export class PerguntasListPage implements OnInit {

	turma$: Observable<Turma>;
	turma: Turma;
	id_turma: string;
	id_topico: string;
	perguntas$: Observable<Pergunta[]>;
	aval: Nota[];
	perg: Pergunta[];
	user: firebase.User;
	usuario: Dado = { id: '', nome: '', matricula: '', email: '', professor: false };
	usuario$: Observable<Dado>;
	tamanho: number = 0;

	constructor(
		private perguntaService: PerguntasService,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private serviceService: LoginService,
		protected db: AngularFirestore,
		private overlayService: OverlayService,
		private turmaService: TurmasService
	) { }

	async ngOnInit() {
		const loading = await this.overlayService.loading( {

		} );
		try {
			await this.authService.authState$.subscribe( user => {
				this.user = user
			} );
			this.usuario.professor = false;
			this.id_turma = this.activatedRoute.snapshot.paramMap.get( 'id' );
			this.id_topico = this.activatedRoute.snapshot.paramMap.get( 'idd' );
			await this.perguntaService.id_Rota( this.id_turma, this.id_topico );
			this.perguntas$ = this.perguntaService.getAll();
			this.usuario$ = this.serviceService.get( this.user.uid );
			this.usuario$.subscribe( usu => {
				this.usuario = usu;
			} );
			this.turma$ = await this.turmaService.getTurma( this.id_turma );
			this.turma$.subscribe( turm => {
				this.turma = turm;
				if ( this.turma.lista !== null ) {
					this.tamanho = this.turma.lista.length;
				} else {
					this.tamanho = 0;
				}
			} )
			await this.perguntas$.subscribe( pergu => {
				this.perg = pergu;
				//this.media( this.perg, this.usuario.id );
			} );
			//this.media( this.perg );
		} catch ( error ) {
			console.log( 'Erro ao criar tarefa: ', error )
			await this.overlayService.toast( {
				message: error.message
			} );
		} finally {
			loading.dismiss();
		}
	}

	async onAvaliarBem( pergunta: Pergunta ): Promise<void> {

		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );

		var time = new Date();
		this.aval = pergunta.avaliacao;
		if ( this.aval == null ) {
			this.aval = [{ id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Like', data_nota: time }];
			const pergunta_aval = { ...pergunta, avaliacao: this.aval };
			await this.perguntaService.update( pergunta_aval );
			this.media( this.perg, pergunta.dono );
			return;
		}

		for ( var i = 0; i < this.aval.length; i++ ) {
			if ( this.aval[i].dono == this.user.uid ) {
				await this.overlayService.toast( {
					message: 'Essa pergunta já foi avaliada!'
				} );
				return;
			}
		}

		this.aval.push( { id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Like', data_nota: time } );
		const pergunta_aval = { ...pergunta, avaliacao: this.aval };
		await this.perguntaService.update( pergunta_aval );
		this.media( this.perg, pergunta.dono );

	}


	async onAvaliarMal( pergunta: Pergunta ): Promise<void> {

		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );

		this.aval = pergunta.avaliacao;
		var time = new Date();

		if ( this.aval == null ) {
			this.aval = [{ id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Dislike', data_nota: time }];
			const pergunta_aval = { ...pergunta, avaliacao: this.aval };
			await this.perguntaService.update( pergunta_aval );
			this.media( this.perg, pergunta.dono );
			return;
		}

		for ( var i = 0; i < this.aval.length; i++ ) {
			if ( this.aval[i].dono == this.user.uid ) {
				await this.overlayService.toast( {
					message: 'Essa pergunta já foi avaliada!'
				} );
				return;
			}
		}

		this.aval.push( { id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Dislike', data_nota: time } );
		const pergunta_aval = { ...pergunta, avaliacao: this.aval };
		await this.perguntaService.update( pergunta_aval );
		this.media( this.perg, pergunta.dono );

	}

	async media( pergunta: Pergunta[], dono: string ) {
		var cont = 0;
		var cont2 = 0;
		var cont3 = 0;
		var tam1 = 0;
		var tam2 = 0;

		for ( var i = 0; i < pergunta.length; i++ ) {
			if ( pergunta[i].dono == dono ) {
				cont++;
				tam2 = 0;
				if ( pergunta[i].avaliacao == null ) {
					tam1 = 0;
				} else {
					tam1 = pergunta[i].avaliacao.length;
				}
				for ( var j = 0; j < tam1; j++ ) {
					if ( pergunta[i].avaliacao[j].like == 'Like' ) {
						tam2 = tam2 + 1;
					} else {
						tam2 = tam2 - 1;
					}
				}
			}
			cont2 = cont2 + tam2;
		}
		cont3 = cont2 / cont;
	
		for ( var i = 0; i < this.turma.lista.length; i++ ) {
			if ( this.turma.lista[i].id_aluno == dono ) {
				this.turma.lista[i].reputacao_compartilhador = cont3;
				await this.turmaService.updateTurma( this.turma );
			}
		}
	}
}
