import { Component, OnInit } from '@angular/core';
import { TurmasService } from 'src/app/turmas/services/turmas.service';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginService } from 'src/app/core/services/service.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Dado } from 'src/app/auth//pages/auth.model';
import { Observable, of } from 'rxjs';
import { Turma, Inscrito } from 'src/app/turmas/Models/Turmas.models';

@Component( {
	selector: 'app-perfil',
	templateUrl: './perfil.page.html',
	styleUrls: ['./perfil.page.scss'],
} )
export class PerfilPage implements OnInit {

	usuario: Dado = { id: '', nome: '', matricula: '', email: '', professor: false };
	usuario$: Observable<Dado>;
	user: firebase.User;
	turmas$: Observable<Turma[]>;
	invite: Inscrito[];

	constructor(
		private turmaService: TurmasService,
		private navCtrl: NavController,
		private authService: AuthService,
		private serviceService: LoginService,
		private overlayService: OverlayService ) { }

	async ngOnInit(): Promise<void> {
		const loading = await this.overlayService.loading( {
			message: 'Carregando...'
		} );
		try {
			await this.authService.authState$.subscribe( user => {
				this.user = user
			} );
			this.turmas$ = this.turmaService.getAllTurma();
			this.usuario$ = this.serviceService.get( this.user.uid );
			await this.usuario$.subscribe( usu => {
				this.usuario = usu;
			} );
		} catch ( error ) {
			console.log( 'Erro ao carregar turmas: ', error )
			await this.overlayService.toast( {
				message: error.message
			} );
		} finally {
			loading.dismiss();
		}
	}

}
