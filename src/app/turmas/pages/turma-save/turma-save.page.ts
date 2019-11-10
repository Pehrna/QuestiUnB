import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TurmasService } from '../../services/turmas.service';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import * as firebase from 'firebase';

//aula 72

@Component( {
	selector: 'app-turma-save',
	templateUrl: './turma-save.page.html',
	styleUrls: ['./turma-save.page.scss'],
} )

export class TurmaSavePage implements OnInit {

	turmaForm: FormGroup;
	pageTitle = '...';
	turmaId: string = null;

	constructor(

		private navCtrl: NavController,
		private fb: FormBuilder,
		private turmaService: TurmasService,
		private overlayService: OverlayService,
		private route: ActivatedRoute
	) { }

	async ngOnInit(): Promise<void> {
			this.createForm();
			this.init();
	}

	init(): void {
		const turmaId = this.route.snapshot.paramMap.get( 'id' );
		if ( !turmaId ) {
			this.pageTitle = 'Criar turma';
			return;
		}
		this.turmaId = turmaId;
		this.pageTitle = 'Editar turma';
		this.turmaService
			.getTurma( turmaId )
			.pipe( take( 1 ) )
			.subscribe( ( { name, password } ) => {
				this.turmaForm.get( 'name' ).setValue( name );
				this.turmaForm.get( 'password' ).setValue( password );
			} );
	}

	private createForm(): void {
		this.turmaForm = this.fb.group( {
			name: ['', [Validators.required, Validators.minLength( 3 )]],
			password: ['', [Validators.required, Validators.minLength( 6 )]],
			dono: firebase.auth().currentUser.uid,
			lista: []
		} );
	}

	async onSubmit(): Promise<void> {
		const loading = await this.overlayService.loading( {
			message: 'Salvando...'
		}

		);
		try {
			!this.turmaId
				? await this.turmaService.createTurma( this.turmaForm.value )
				: await this.turmaService.updateTurma( {
					id: this.turmaId,
					... this.turmaForm.value
				} );
			this.navCtrl.navigateBack( '/turmas' );
		} catch ( error ) {
			console.log( 'Erro ao salvar turma: ', error )
			await this.overlayService.toast( {
				message: error.message
			} );
		} finally {
			loading.dismiss();
		}
	}
}
