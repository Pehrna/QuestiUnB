import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PerguntasService } from '../../services/perguntas.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TurmasService } from 'src/app/turmas/services/turmas.service';
import { Turma } from 'src/app/turmas/Models/Turmas.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { TopicosService } from 'src/app/topicos/services/topicos.service';
import { Topico } from 'src/app/topicos/models/topico.model';

@Component( {
	selector: 'app-pergunta-save',
	templateUrl: './pergunta-save.page.html',
	styleUrls: ['./pergunta-save.page.scss'],
} )
export class PerguntaSavePage implements OnInit {

	perguntaForm: FormGroup;
	id_turma: string;
	id_topico: string;
	turma: Turma;
	topico: Topico;
	user: firebase.User;


	constructor( private fb: FormBuilder,
		private authService: AuthService,
		private turmaService: TurmasService,
		private perguntaService: PerguntasService,
		private navCtrl: NavController,
		private activatedRoute: ActivatedRoute,
		private overlayService: OverlayService,
		private topicoService: TopicosService

	) { }

	async ngOnInit(): Promise<void> {

		this.createForm();
		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );

		this.id_turma = this.activatedRoute.snapshot.paramMap.get( 'id' );
		this.id_topico = this.activatedRoute.snapshot.paramMap.get( 'idd' );
		const turma$ = await this.turmaService.getTurma( this.id_turma );
		const topico$ = await this.topicoService.get( this.id_topico );

		await turma$.subscribe( turm => {
			this.turma = turm;
		} );

		await topico$.subscribe( topic => {
			this.topico = topic;
		} );
	}


	private createForm(): void {
		this.perguntaForm = this.fb.group( {
			texto: ['', [Validators.required, Validators.minLength( 10 )]],
			invest: [],
			avaliacao: [],
			data_criacao: Date(),
			dono: null,
			excedente: false
		} );
	}


	async onSubmit(): Promise<void> {

		const loading = await this.overlayService.loading( {
			message: 'Salvando...'
		}

		);

		this.perguntaForm.value.invest ? null : this.perguntaForm.value.invest = 1;
		try {
			this.perguntaForm.value.dono = this.user.uid;

			for ( var i = 0; i < this.turma.lista.length; i++ ) {
				if ( this.turma.lista[i].id_aluno == this.user.uid ) {

					const moeda = this.turma.lista[i].moedas - this.perguntaForm.value.invest
					if ( moeda < 0 ) {
						await this.overlayService.toast( {
							message: 'Limite de moedas excedido!'
						} );
						return;
					}
					this.turma.lista[i].moedas = moeda;
					for ( var j = 0; j < this.turma.lista[i].lista_topico.length; j++ ) {					
						if ( this.turma.lista[i].lista_topico[j].nome_topico == this.topico.title ) {
							this.turma.lista[i].lista_topico[j].qtd_questoes++;
						}
					}

					this.turmaService.updateTurma( this.turma );
					//if ( this.turma.lista )
				}
			}

			const pergunta = await this.perguntaService.create_pergunta( this.perguntaForm.value );

			this.navCtrl.navigateBack( '/turmas/' + this.id_turma + '/topicos/' + this.id_topico + '/perguntas' );
		}
		catch ( error ) {
			console.log( error );
		} finally {
			loading.dismiss();
		}
	}

}
