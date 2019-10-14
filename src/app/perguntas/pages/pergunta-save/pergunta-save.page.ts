import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PerguntasService } from '../../services/perguntas.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TurmasService } from 'src/app/turmas/services/turmas.service';
import { Turma } from 'src/app/turmas/Models/Turmas.models';
import { AuthService } from 'src/app/core/services/auth.service';

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
	user: firebase.User;


	constructor( private fb: FormBuilder,
		private authService: AuthService,
		private turmaService: TurmasService,
		private perguntaService: PerguntasService,
		private navCtrl: NavController,
		private activatedRoute: ActivatedRoute
	) { }

	async ngOnInit(): Promise<void> {

		this.createForm();
		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );

		this.id_turma = this.activatedRoute.snapshot.paramMap.get( 'id' );
		this.id_topico = this.activatedRoute.snapshot.paramMap.get( 'idd' );
		const turma2 = await this.turmaService.getTurma( this.id_turma );

		await turma2.subscribe( turm => {
			this.turma = turm;
		} );
	}


	private createForm(): void {
		this.perguntaForm = this.fb.group( {
			texto: ['', [Validators.required, Validators.minLength( 10 )]],
			invest: [],
			avaliacao: [],
			data_criacao: Date(),
			dono: null
		} );
	}


	async onSubmit(): Promise<void> {
		this.perguntaForm.value.invest ? null : this.perguntaForm.value.invest = 1;
		try {
			this.perguntaForm.value.dono = this.user.uid;
			const pergunta = await this.perguntaService.create_pergunta( this.perguntaForm.value );

			for ( var i = 0; i < this.turma.lista.length; i++ ) {
				if ( this.turma.lista[i].id_aluno == this.user.uid ) {
					const moeda = this.turma.lista[i].moedas - this.perguntaForm.value.invest
					this.turma.lista[i].moedas = moeda;
					this.turmaService.updateTurma( this.turma );
				}
			}

			this.navCtrl.navigateBack( '/turmas/' + this.id_turma + '/topicos/' + this.id_topico + '/perguntas' );
		}
		catch ( error ) {
			console.log( error );
		}
	}

}
