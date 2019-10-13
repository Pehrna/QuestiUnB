import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Turma } from 'src/app/turmas/Models/Turmas.models';
import { Dado } from 'src/app/auth/pages/auth.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginService } from 'src/app/core/services/service.service';
import { NavController } from '@ionic/angular';


@Component( {
	selector: 'app-turma-item',
	template: '<button (click)="sendMessage()">Send Message</button>',
	templateUrl: './turma-item.component.html',
	styleUrls: ['./turma-item.component.scss'],
} )
export class TurmaItemComponent {

	user: firebase.User;
	usuario: Dado = { ...this.usuario, professor: false };
	usuario$: Observable<Dado>;
	likes: number = 0;
	dislikes: number = 0;
	tamanho: number = 0;
	divDisable: boolean = false;
	token: number = 0;
	matriculado: boolean = false;

	constructor(
		private authService: AuthService,
		private serviceService: LoginService
	) { }


	@Input() turma: Turma;
	@Output() done = new EventEmitter<Turma>();
	@Output() update = new EventEmitter<Turma>();
	@Output() delete = new EventEmitter<Turma>();
	@Output() select = new EventEmitter<Turma>();

	async ngOnInit() {

		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );
		this.usuario$ = this.serviceService.get( this.user.uid );
		await this.usuario$.subscribe( usu => {
			this.usuario = usu;
		} );

		if ( this.turma.lista == null ) {
			this.turma.lista = [];
		}

		this.tamanho = this.turma.lista.length;

		for ( var i = 0; i < this.tamanho; i++ ) {
			if ( this.turma.lista[i].id_aluno == this.user.uid ) {
				this.matriculado = true;
				//this.navCtrl.navigateForward( '/turmas/' + turma.id + '/topicos' );
				return;
			}
		}


	}

}
