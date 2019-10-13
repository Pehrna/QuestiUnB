import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pergunta, Nota } from '../../models/pergunta.model';
import { Dado } from 'src/app/auth/pages/auth.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginService } from 'src/app/core/services/service.service';


@Component( {
	selector: 'app-pergunta-item',
	//template: '<button (click)="sendMessage()">Send Message</button>',
	templateUrl: './pergunta-item.component.html',
	styleUrls: ['./pergunta-item.component.scss'],
} )
export class PerguntaItemComponent {

	user: firebase.User;
	usuario: Dado = { ...this.usuario, professor: false };
	usuario$: Observable<Dado>;
	likes: number = 0;
	dislikes: number = 0;
	tamanho: number = 0;
	divDisable: boolean = false;
	token: number = 0;

	constructor( private authService: AuthService, private serviceService: LoginService ) { }


	@Input() pergunta: Pergunta;
	@Input() nota: Nota;
	@Output() done = new EventEmitter<Pergunta>();
	@Output() update = new EventEmitter<Pergunta>();
	@Output() delete = new EventEmitter<Pergunta>();
	@Output() avaliarBem = new EventEmitter<Nota>();
	@Output() avaliarMal = new EventEmitter<Nota>();

	async ngOnInit() {

		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );
		this.usuario$ = this.serviceService.get( this.user.uid );
		await this.usuario$.subscribe( usu => {
			this.usuario = usu;
		} );
		if ( this.pergunta.avaliacao == null ) {
			this.tamanho = 0;
		} else {
			this.tamanho = this.pergunta.avaliacao.length;
		}
		for ( var i = 0; i < this.tamanho; i++ ) {

			if ( this.pergunta.avaliacao[i].dono == this.user.uid ) {

				this.divDisable = true;
			}
		}
		if ( this.pergunta.dono == this.user.uid ) {
			this.divDisable = true;
		}

		if ( this.pergunta.avaliacao == null ) {
		} else {
			this.tamanho = this.pergunta.avaliacao.length;

			for ( var i = 0; i < this.tamanho; i++ ) {
				if ( this.pergunta.avaliacao[i].like == 'Like' ) {
					this.likes++;
				} else {
					this.dislikes++
				}
			}
		}

	}

}
