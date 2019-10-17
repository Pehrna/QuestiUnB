import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TopicosService } from '../../services/topicos.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { OverlayService } from 'src/app/core/services/overlay.service';


@Component( {
	selector: 'app-topico-save',
	templateUrl: './topico-save.page.html',
	styleUrls: ['./topico-save.page.scss'],
} )
export class TopicoSavePage implements OnInit {

	topicoForm: FormGroup;
	id_turma: string;
	message: string;

	@Output() messageEvent = new EventEmitter<string>();

	constructor(
		private fb: FormBuilder,
		private topicoService: TopicosService,
		private navCtrl: NavController,
		private activatedRoute: ActivatedRoute,
		private overlayService: OverlayService 
	) { }

	ngOnInit() {
		this.createForm();
		this.id_turma = this.activatedRoute.snapshot.paramMap.get( 'id' );


	}

	createForm(): void {
		this.topicoForm = this.fb.group( {
			title: ['', [Validators.required, Validators.minLength( 3 )]],
			data_inicio: [''],
			data_fim: [''],
			data_criada: Date(),
			id_turma: [this.id_turma],
			encerrado: false,
			quantidade: ['']
		} );
	}

	sendMensagem() {
		this.messageEvent.emit( this.id_turma )
	}

	async onSubmit(): Promise<void> {
		const loading = await this.overlayService.loading( {
			message: 'Salvando...'
		}

		);
		try {
			var b = this.topicoForm.value.data_inicio;
			b = b.substring( 0, 11 ) + '00:01:00.000-03:00';
			this.topicoForm.value.data_inicio = b;

			b = this.topicoForm.value.data_fim;
			b = b.substring( 0, 11 ) + '23:59:00.000-03:00';
			this.topicoForm.value.data_fim = b;

			this.topicoForm.value.id_turma = this.id_turma;

			await this.topicoService.id_Turma( this.id_turma );
			const topico2 = await this.topicoService.create_topico( this.topicoForm.value );
			this.navCtrl.navigateBack( '/turmas/' + this.id_turma + '/topicos' );
		} catch ( error ) {
			console.log( 'Erro: ', error )
		} finally {
			loading.dismiss();
		}
	}
}
