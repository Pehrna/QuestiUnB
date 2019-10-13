//aula 58 a 63

import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export abstract class Firestore<T extends { id: string }> {

	protected collection: AngularFirestoreCollection<T>;

	constructor( protected db: AngularFirestore ) { }

	protected setCollection( path: string, queryFn?: QueryFn ): void {
		this.collection = path ? this.db.collection( path, queryFn ) : null;
	}

	private setItem( item: T, operation: string ): Promise<T> {
		return this.collection
			.doc<T>( item.id )
		[operation]( item )
			.then( () => item );
	}

	private setInscrito( item: T, operation: string ): Promise<T> {
		!item.id ? item.id = this.db.createId() : null;

		return this.collection
			.doc<T>( item.id )
		[operation]( item )
			.then( () => item );
	}

	getAll(): Observable<T[]> {
		return this.collection.valueChanges();
	}

	get( id: string ): Observable<T> {
		return this.collection.doc<T>( id ).valueChanges();
	}

	get_turma( id: string ): Observable<T> {
		return this.collection.doc<T>( id ).valueChanges();
	}

	create( item: T ): Promise<T> {
		!item.id ? item.id = this.db.createId() : null;
		return this.setItem( item, 'set' );
	}

	create_topico( item: T ): Promise<T> {
		item.id = this.db.createId();
		return this.setItem( item, 'set' );
	}

	create_pergunta( item: T ): Promise<T> {
		item.id = this.db.createId();
		return this.setItem( item, 'set' );
	}

	update( item: T ): Promise<T> {
		return this.setItem( item, 'update' );
	}

	//updateAvaliacao( item: T ): Promise<T> {

	//	return this.setItem( item, 'update' );
	//}

	delete( item: T ): Promise<void> {
		return this.collection.doc<T>( item.id ).delete();
	}

}
