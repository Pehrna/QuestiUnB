//aula 58 a 63

import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export abstract class FirestoreTurma<T extends { id: string }> {

	protected collection: AngularFirestoreCollection<T>;

	constructor( protected db: AngularFirestore ) { }

	protected setCollectionTurma( path: string, queryFn?: QueryFn ): void {
		this.collection = path ? this.db.collection( path, queryFn ) : null;
	}

	private setItemTurma( item: T, operation: string ): Promise<T> {
		return this.collection
			.doc<T>( item.id )
		[operation]( item )
			.then( () => item );
	}

	getAllTurma(): Observable<T[]> {
		return this.collection.valueChanges();

	}

	getTurma( id: string ): Observable<T> {
		return this.collection.doc<T>( id ).valueChanges();
	}

	createTurma( item: T ): Promise<T> {
		!item.id ? item.id = this.db.createId() : console.log( '' );
		return this.setItemTurma( item, 'set' );
	}

	updateTurma( item: T ): Promise<T> {
		return this.setItemTurma( item, 'update' );
	}

	deleteTurma( item: T ): Promise<void> {
		return this.collection.doc<T>( item.id ).delete();
	}

}
