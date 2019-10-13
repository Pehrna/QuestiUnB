//aula 65

import { Injectable } from '@angular/core';
import { FirestoreTurma } from 'src/app/core/classes/firestore-turma';
import { Turma } from '../Models/Turmas.models';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable( {
	providedIn: 'root'
} )
export class TurmasService extends FirestoreTurma<Turma> {

	constructor( private authService: AuthService, db: AngularFirestore ) {
		super( db );
		this.init();
	}

	private init(): void {
		this.authService.authState$.subscribe( user => {
			if ( user ) {
				this.setCollectionTurma( 'turmas/', ref =>
					ref.orderBy( 'name', 'asc' )
				);
				return;
			}
			this.setCollectionTurma( null );
		} );
	}
}
