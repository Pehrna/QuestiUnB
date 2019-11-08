import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Turma, Inscrito } from 'src/app/turmas/Models/Turmas.models';
import { TurmasService } from 'src/app/turmas/services/turmas.service';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { Dado } from 'src/app/auth//pages/auth.model';
import { LoginService } from 'src/app/core/services/service.service';

@Component( {
	selector: 'app-minhasturmas-list',
	templateUrl: './minhasturmas-list.page.html',
	styleUrls: ['./minhasturmas-list.page.scss'],
} )
export class MinhasturmasListPage implements OnInit {

	usuario: Dado = { id: '', nome: '', matricula: '', email: '', professor: false };
	usuario$: Observable<Dado>;
	user: firebase.User;
	turmas$: Observable<Turma[]>;
	invite: Inscrito[];

	constructor(
		private turmaService: TurmasService,
		private navCtrl: NavController,
		private authService: AuthService,
		private serviceService: LoginService ) { }

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

	async onSelect( turma: Turma ): Promise<void> {

		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );

		if ( turma.dono == this.usuario.id ) {
			this.navCtrl.navigateForward( '/turmas/' + turma.id + '/topicos' );
			return;
		}

		this.invite = turma.lista;
		if ( this.invite == null ) {
			this.invite = [{ id_turma: turma.id, id_aluno: this.user.uid, nota: 0, moedas: 30, posicao: 0, reputacao_compartilhador: 0, reputacao_avaliador: 0, lista_topico:[] }];
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

	onUpdate( turma: Turma ): void {
		var b = '/turmas/editarTurma/' + turma.id;
		this.navCtrl.navigateForward( b );

	}
}

