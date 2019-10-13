//Aula 66

import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { Topico } from '../models/topico.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable( {
	providedIn: 'root'
} )
export class TopicosService extends Firestore<Topico> {

	id_aqui: string = 'Eita'

	constructor( private authService: AuthService,
		db: AngularFirestore ) {
		super( db );
		this.init();
	}


	id_Turma( id: string ): void {
		this.id_aqui = id;
		this.init();
	}

	private init(): void {
		if ( this.id_aqui != 'Eita' ) {
			this.authService.authState$.subscribe( user => {
				if ( user ) {
					this.setCollection( '/turmas/' + this.id_aqui + '/topicos', ref =>
						ref.orderBy( 'data_criada', 'desc' ) );
					return;
				}
				this.setCollection( null );
			} );
		}
	}
}
