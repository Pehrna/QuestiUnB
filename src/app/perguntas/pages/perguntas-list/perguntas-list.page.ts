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

@Component( {
	selector: 'app-perguntas-list',
	templateUrl: './perguntas-list.page.html',
	styleUrls: ['./perguntas-list.page.scss'],
} )
export class PerguntasListPage implements OnInit {
	id_turma: string;
	id_topico: string;
	perguntas$: Observable<Pergunta[]>;
	aval: Nota[];
	perg: Pergunta[];
	user: firebase.User;
	usuario: Dado = { id: '', nome: '', matricula: '', email: '', professor: false };
	usuario$: Observable<Dado>;


	constructor( private perguntaService: PerguntasService,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private serviceService: LoginService,
		protected db: AngularFirestore,
		private overlayService: OverlayService
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
			await this.perguntas$.subscribe( pergu => {
				this.perg = pergu;
			} );
		} catch ( error ) {
			console.log( 'Erro ao criar tarefa: ', error )
			await this.overlayService.toast( {
				message: error.message
			} );
		} finally {
			//console.log( this.perg );
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
	}



}
