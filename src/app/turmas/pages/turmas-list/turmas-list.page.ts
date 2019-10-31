import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Turma, Inscrito } from 'src/app/turmas/Models/Turmas.models';
import { TurmasService } from '../../services/turmas.service';
import { NavController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { Dado } from 'src/app/auth//pages/auth.model';
import { LoginService } from 'src/app/core/services/service.service';
import { TurmaLoginPage } from '../turma-login/turma-login.page';
import { OverlayService } from 'src/app/core/services/overlay.service';


@Component( {
	selector: 'app-turmas-list',
	templateUrl: './turmas-list.page.html',
	styleUrls: ['./turmas-list.page.scss'],
} )
export class TurmasListPage implements OnInit {

	usuario: Dado = { id: '', nome: '', matricula: '', email: '', professor: false };
	usuario$: Observable<Dado>;
	user: firebase.User;
	turmas$: Observable<Turma[]>;
	invite: Inscrito[];
	matriculado: boolean = false;
	tamanho: number = 0;
	dataReturned: any;


	constructor(
		private turmaService: TurmasService,
		private navCtrl: NavController,
		private authService: AuthService,
		private serviceService: LoginService,
		private popoverCtrl: PopoverController,
		private overlayService: OverlayService

	) { }

	async ngOnInit(): Promise<void> {
		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );
		this.turmas$ = this.turmaService.getAllTurma();
		this.usuario$ = this.serviceService.get( this.user.uid );
		await this.usuario$.subscribe( usu => {
			this.usuario = usu;
		} );
	}

	async abra( turma: Turma ) {

		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );

		if ( turma.dono == this.usuario.id ) {
			this.navCtrl.navigateForward( '/turmas/' + turma.id + '/topicos' );
			return;
		}

		if ( turma.lista == null ) {
			turma.lista = [];
		}

		this.tamanho = turma.lista.length;

		for ( var i = 0; i < this.tamanho; i++ ) {
			if ( turma.lista[i].id_aluno == this.user.uid ) {
				this.navCtrl.navigateForward( '/turmas/' + turma.id + '/topicos' );
				return;
			}
		}

		const pop = await this.popoverCtrl.create( {
			component: TurmaLoginPage,
			componentProps: {
				"password": turma.password,
			}
		} );

		pop.onDidDismiss().then( ( dataReturned ) => {
			if ( dataReturned !== null ) {
				this.dataReturned = dataReturned.data;
				this.onSelect( turma, this.dataReturned );
			}
		} );


		return await pop.present();

	}

	async onSelect( turma: Turma, teste: boolean ): Promise<void> {

		if ( teste ) {
			const loading = await this.overlayService.loading( {} );

			try {
				this.invite = turma.lista;
				if ( this.invite == null ) {
					this.invite = [{ id_turma: turma.id, id_aluno: this.user.uid, nota: 0, moedas: 30, posicao: 0, reputacao_compartilhador: 0, reputacao_avaliador: 0, lista_topico: [] }];
					const turma_Inscricao = { ...turma, lista: this.invite };
					await this.turmaService.updateTurma( turma_Inscricao );
					this.navCtrl.navigateForward( '/turmas/' + turma.id + '/topicos' );
					return;
				}

				for ( var i = 0; i < this.invite.length; i++ ) {
					if ( this.invite[i].id_aluno == this.user.uid ) {
						this.navCtrl.navigateForward( '/turmas/' + turma.id + '/topicos' );
						return;
					}
				}

				this.invite.push( { id_turma: turma.id, id_aluno: this.user.uid, nota: 0, moedas: 30, posicao: turma.lista.length, reputacao_compartilhador: 0, reputacao_avaliador: 0, lista_topico: [] } );
				const turma_Inscricao = { ...turma, lista: this.invite };
				await this.turmaService.updateTurma( turma_Inscricao );
				this.navCtrl.navigateForward( '/turmas/' + turma.id + '/topicos' );
			}
			catch ( error ) {
				console.log( 'Erro ao criar tarefa: ', error )
				await this.overlayService.toast( {
					message: error.message
				} );
			} finally {
				//console.log( this.perg );
				loading.dismiss();
			}

		} else {
			await this.overlayService.toast( {
				message: 'Essa senha esta incorreta!'
			} );
		}
	}
}
