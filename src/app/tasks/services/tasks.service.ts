import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable( {
	providedIn: 'root'
} )
export class TasksService extends Firestore<Task>{

	constructor( private authService: AuthService, db: AngularFirestore ) {
		super( db );
		this.init();
	}

	private init(): void {
		this.authService.authState$.subscribe( user => {
			if ( user ) {
				var b = '/users/' + user.uid + '/tasks';
				this.setCollection( b, ref =>
					ref.orderBy( 'done', 'desc' ).orderBy( 'data', 'asc' )
				);
				return;
			}
			this.setCollection( null );
		} );
	}
}
