import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TopicosService } from '../../services/topicos.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Turma, Questoes } from 'src/app/turmas/Models/Turmas.models';
import { TurmasService } from 'src/app/turmas/services/turmas.service';


@Component( {
	selector: 'app-topico-save',
	templateUrl: './topico-save.page.html',
	styleUrls: ['./topico-save.page.scss'],
} )
export class TopicoSavePage implements OnInit {

	topicoForm: FormGroup;
	id_turma: string;
	message: string;
	turma: Turma;
	aux = 0;
	aux2 = 0;

	questao: Questoes[];

	@Output() messageEvent = new EventEmitter<string>();

	constructor(
		private fb: FormBuilder,
		private topicoService: TopicosService,
		private turmaService: TurmasService,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private overlayService: OverlayService
	) { }

	async ngOnInit() {
		this.createForm();
		this.id_turma = this.activatedRoute.snapshot.paramMap.get( 'id' );
		const turma2 = await this.turmaService.getTurma( this.id_turma );

		await turma2.subscribe( turm => {
			this.turma = turm;
		} );


	}

	createForm(): void {
		this.topicoForm = this.fb.group( {
			title: ['', [Validators.required, Validators.minLength( 3 )]],
			data_inicio: [''],
			data_fim: [''],
			data_criada: Date(),
			id_turma: [this.id_turma],
			encerrado: false,
			quantidade: [''],
			peso_pergunta: [''],
			peso_avaliacao: ['']
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
			if ( this.turma.lista == null ) {
				await this.overlayService.toast( {
					message: 'Nao existe alunos nessa turma!'
				} );
				return;
			}

			for ( var i = 0; i < this.turma.lista.length; i++ ) {
				this.aux = this.aux + this.turma.lista[i].reputacao_compartilhador;
			}
			for ( var i = 0; i < this.turma.lista.length; i++ ) {
				this.questao = this.turma.lista[i].lista_topico;
				if ( this.aux != 0 ) {
					this.aux2 = this.topicoForm.value.quantidade * ( this.turma.lista[i].reputacao_compartilhador / this.aux );
				} else {
					this.aux2 = this.topicoForm.value.quantidade / this.turma.lista.length;
				}
				this.questao.push( { id_turma: this.turma.id, id_aluno: this.turma.lista[i].id_aluno, nome_topico: this.topicoForm.value.title, qtd_questoes: 0, qtd_esperada: this.aux2, fator_recompensa: 1 } );
				this.turma.lista[i].lista_topico = this.questao;
				const turma_aux = this.turma;
				await this.turmaService.updateTurma( turma_aux );
			}

			const topico2 = await this.topicoService.create_topico( this.topicoForm.value );

			this.navCtrl.navigateBack( '/turmas/' + this.id_turma + '/topicos' );
		} catch ( error ) {
			console.log( 'Erro: ', error )
		} finally {
			loading.dismiss();
		}
	}
}
