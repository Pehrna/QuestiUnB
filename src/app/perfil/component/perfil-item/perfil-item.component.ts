import { Component, Input, Output, EventEmitter } from '@angular/core';
import { perfil } from '../../Models/perfil.model';
import { Dado } from 'src/app/auth/pages/auth.model';
import { Observable } from 'rxjs';
import { Turma } from 'src/app/turmas/Models/Turmas.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginService } from 'src/app/core/services/service.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { TurmasService } from 'src/app/turmas/services/turmas.service';



@Component( {
	selector: 'app-perfil-item',
	templateUrl: './perfil-item.component.html',
	styleUrls: ['./perfil-item.component.scss'],
} )
export class PerfilItemComponent {

	user: firebase.User;
	usuario: Dado = { ...this.usuario, professor: false };
	usuario$: Observable<Dado>;
	turmas$: Observable<Turma[]>;
	turmas: Turma[];
	tchurma: Turma;
	tamanho: number = 0;
	divDisable: boolean = false;
	haveQuestion: boolean = false;
	nota: number = 0;

	constructor(
		private authService: AuthService,
		private serviceService: LoginService,
		private overlayService: OverlayService,
		private turmaService: TurmasService
	) { }

	@Input() turma: Turma;
	@Output() id = new EventEmitter<perfil>();
	@Output() vai = new EventEmitter<perfil>();

	async ngOnInit() {
		const loading = await this.overlayService.loading( {
			message: 'Carregando...'
		} );
		try {

			if ( this.turma.lista !== null ) {
				this.tamanho = this.turma.lista.length;
			} else {
				this.tamanho = 0;
			}
			await this.authService.authState$.subscribe( user => {
				this.user = user
			} );
			this.usuario$ = this.serviceService.get( this.user.uid );
			await this.usuario$.subscribe( usu => {
				this.usuario = usu;
			} );

			if ( this.tamanho == 0 && this.turma.dono == this.user.uid ) {
				this.divDisable = true;
			}

			for ( var i = 0; i < this.tamanho; i++ ) {
				if ( this.turma.lista !== undefined || this.turma.dono == this.user.uid ) {
					if ( this.turma.lista[i].id_aluno == this.user.uid || this.turma.dono == this.user.uid ) {
						this.divDisable = true;
						this.nota = this.turma.lista[i].nota;
						for ( var j = 0; j < this.turma.lista[i].lista_topico.length; j++ ) {
							if ( this.turma.lista[i].lista_topico[j].qtd_questoes < this.turma.lista[i].lista_topico[j].qtd_esperada ) {
								this.haveQuestion = true;
							}							
						}
					}
				}
			}

			this.turmas$ = this.turmaService.getAllTurma();
			await this.turmas$.subscribe( turm => {

				this.turmas = turm;

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
