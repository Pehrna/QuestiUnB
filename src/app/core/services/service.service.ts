import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';
import { Dado } from 'src/app/auth/pages/auth.model';

@Injectable( {
	providedIn: 'root'
} )
export class LoginService extends Firestore<Dado>{

	constructor( private authService: AuthService, db: AngularFirestore ) {
		super( db );
		this.init();

	}

	private init(): void {
		this.authService.authState$.subscribe( user => {
			if ( user ) {
				this.setCollection( '/Usuario' );
				return;
			}
			this.setCollection( null );
		} );
	}
}