import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { Pergunta } from '../models/pergunta.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable( {
	providedIn: 'root'
} )
export class PerguntasService extends Firestore<Pergunta>	{

	id_um: string = 'Eita';
	id_dois: string = 'Eita';

	constructor( db: AngularFirestore, private authService: AuthService ) {
		super( db );
		this.init();
	}

	id_Rota( idum: string, iddois: string ): void {
		this.id_um = idum;
		this.id_dois = iddois;
		this.init();
	}

	private init(): void {
		if ( this.id_um != 'Eita' ) {
			this.authService.authState$.subscribe( user => {
				if ( user ) {
					this.setCollection( '/turmas/' + this.id_um + '/topicos/' + this.id_dois + '/perguntas', ref =>
						ref.orderBy( 'invest', 'desc' ).orderBy( 'data_criacao', 'asc' ) );
					return;
				}
				this.setCollection( null );
			} );
		}
	}

}
