import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Turma } from 'src/app/turmas/Models/Turmas.models';
import { Dado } from 'src/app/auth/pages/auth.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginService } from 'src/app/core/services/service.service';

@Component( {
	selector: 'app-minhasturmas-item',
	//template: '<button (click)="sendMessage()">Send Message</button>',
	templateUrl: './minhasturmas-item.component.html',
	styleUrls: ['./minhasturmas-item.component.scss'],
} )
export class MinhasTurmasItemComponent {

	user: firebase.User;
	usuario: Dado = { ...this.usuario, professor: false };
	usuario$: Observable<Dado>;
	tamanho: number = 0;
	divDisable: boolean = false;

	constructor( private authService: AuthService, private serviceService: LoginService ) { }

	@Input() turma: Turma;
	@Output() done = new EventEmitter<Turma>();
	@Output() update = new EventEmitter<Turma>();
	@Output() delete = new EventEmitter<Turma>();
	@Output() select = new EventEmitter<Turma>();

	async ngOnInit() {

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
				}
			}
		}
	}
}
