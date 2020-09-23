import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Pergunta, Nota } from '../../models/pergunta.model';
import { PerguntasService } from '../../services/perguntas.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Dado } from 'src/app/auth/pages/auth.model';
import { LoginService } from 'src/app/core/services/service.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Turma } from 'src/app/turmas/Models/Turmas.models';
import { TurmasService } from 'src/app/turmas/services/turmas.service';
import { Topico } from 'src/app/topicos/models/topico.model';
import { TopicosService } from 'src/app/topicos/services/topicos.service';

@Component( {
	selector: 'app-perguntas-list',
	templateUrl: './perguntas-list.page.html',
	styleUrls: ['./perguntas-list.page.scss'],
} )
export class PerguntasListPage implements OnInit {

	perguntaForm: FormGroup;
	turma$: Observable<Turma>;
	turma: Turma;
	id_turma: string;
	id_topico: string;
	perguntas$: Observable<Pergunta[]>;
	aval: Nota[];
	perg: Pergunta[];
	user: firebase.User;
	usuario$: Observable<Dado>;
	usuario: Dado = { id: '', nome: '', matricula: '', email: '', professor: false };
	topico$: Observable<Topico>;
	topico: Topico;
	tamanho: number = 0;

	constructor(
		private fb: FormBuilder,
		private perguntaService: PerguntasService,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private serviceService: LoginService,
		protected db: AngularFirestore,
		private overlayService: OverlayService,
		private turmaService: TurmasService,
		private topicoService: TopicosService
	) { }

	async ngOnInit() {

		this.createForm();


		const loading = await this.overlayService.loading( {
			message: 'Carregando...'
		} );
		try {
			await this.authService.authState$.subscribe( user => {
				this.user = user
			} );
			this.usuario.professor = false;
			this.id_turma = this.activatedRoute.snapshot.paramMap.get( 'id' );
			this.id_topico = this.activatedRoute.snapshot.paramMap.get( 'idd' );
			await this.perguntaService.id_Rota( this.id_turma, this.id_topico );
			this.perguntas$ = this.perguntaService.getAll();

			this.usuario$ = this.serviceService.get( this.user.uid );
			this.usuario$.subscribe( usu => {
				this.usuario = usu;
			} );
			this.turma$ = await this.turmaService.getTurma( this.id_turma );
			this.turma$.subscribe( turm => {
				this.turma = turm;
				if ( this.turma.lista !== null ) {
					this.tamanho = this.turma.lista.length;
				} else {
					this.tamanho = 0;
				}
			} )
			await this.perguntas$.subscribe( pergu => {
				this.perg = pergu;
			} );
			this.topico$ = this.topicoService.get( this.id_topico );
			this.topico$.subscribe( topi => {
				this.topico = topi;
			} );
		} catch ( error ) {
			console.log( 'Erro ao criar tarefa: ', error )
			await this.overlayService.toast( {
				message: error.message
			} );
		} finally {
			loading.dismiss();
		}
	}

	createForm(): void {
		this.perguntaForm = this.fb.group( {

			data_criacao: Date(),

		} );
	}

	async onAvaliarBem( pergunta: Pergunta ): Promise<void> {
		//Aqui função pra adicionar like nas avaliações dessa pergunta

		var data_avaliacao = new Date();
		this.perguntaForm.value.data_criacao = Date();
		const loading = await this.overlayService.loading( {
			message: 'Atualizando...'
		} );
		try {
			await this.authService.authState$.subscribe( user => {
				this.user = user
			} );

			this.aval = pergunta.avaliacao;
			if ( this.aval == null ) {
				this.aval = [{ id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Like', data_nota: this.perguntaForm.value.data_criacao }];
				const pergunta_aval = { ...pergunta, avaliacao: this.aval };
				await this.perguntaService.update( pergunta_aval );
				this.media( this.perg, this.topico, pergunta.dono );
				return;
			}

			for ( var i = 0; i < this.aval.length; i++ ) {
				if ( this.aval[i].dono == this.user.uid ) {
					await this.overlayService.toast( {
						message: 'Essa pergunta j� foi avaliada!'
					} );
					return;
				}
			}

			this.aval.push( { id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Like', data_nota: this.perguntaForm.value.data_criacao } );
			const pergunta_aval = { ...pergunta, avaliacao: this.aval };
			await this.perguntaService.update( pergunta_aval );
			this.media( this.perg, this.topico, pergunta.dono );
		}
		catch ( error ) {
			console.log( error );
		} finally {
			loading.dismiss();
		}
	}



	async onAvaliarMal( pergunta: Pergunta ): Promise<void> {
		//Aqui função pra adicionar dislike nas avaliações dessa pergunta

		const loading = await this.overlayService.loading( {
			message: 'Atualizando...'
		} );
		try {
			await this.authService.authState$.subscribe( user => {
				this.user = user
			} );

			this.aval = pergunta.avaliacao;

			if ( this.aval == null ) {
				this.aval = [{ id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Dislike', data_nota: this.perguntaForm.value.data_criacao }];
				const pergunta_aval = { ...pergunta, avaliacao: this.aval };
				await this.perguntaService.update( pergunta_aval );
				this.media( this.perg, this.topico, pergunta.dono );
				return;
			}

			for ( var i = 0; i < this.aval.length; i++ ) {
				if ( this.aval[i].dono == this.user.uid ) {
					await this.overlayService.toast( {
						message: 'Essa pergunta j� foi avaliada!'
					} );
					return;
				}
			}

			this.aval.push( { id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Dislike', data_nota: this.perguntaForm.value.data_criacao } );
			const pergunta_aval = { ...pergunta, avaliacao: this.aval };
			await this.perguntaService.update( pergunta_aval );
			this.media( this.perg, this.topico, pergunta.dono );
		}
		catch ( error ) {
			console.log( error );
		} finally {
			loading.dismiss();
		}
	}


	diferenca_data_topico_para_pergunta( date_topico_inicio: Date, date_topico_fim: Date, date_pergunta: Date ) {		
//Calcula o tempo da pergunta desde a abertura do topico

		console.log( "Data inicio topico: ", date_topico_inicio );
		console.log( "Data fim topico: ", date_topico_fim );
		console.log( "Data da pergunta: ", date_pergunta );

		var b = date_pergunta.toString();

		b = b.substring( 0, 16 ) + '00:01:00.000-03:00';

		console.log("b: ", b);

		var diferenca_date_topicos_milisec = new Date( date_topico_fim ).getTime() - new Date( date_topico_inicio ).getTime();

		var diferenca_date_dias_topico = Math.ceil( diferenca_date_topicos_milisec / ( 1000 * 60 * 60 * 24 ) );

		console.log( "Diferenca em dias das datas topicos: ", diferenca_date_dias_topico  );

		var diferenca_date_pergunta_milisec = new Date( b ).getTime() - new Date( date_topico_inicio ).getTime();

		var diferenca_date_pergunta_para_topico = Math.ceil( diferenca_date_pergunta_milisec / ( 1000 * 60 * 60 * 24 ) );

		console.log( "Diferenca em dias da data inicio topicos e pergunta: ", diferenca_date_pergunta_para_topico );

		var resultado = ( diferenca_date_dias_topico - diferenca_date_pergunta_para_topico ) / diferenca_date_dias_topico;

		console.log( "Resultado: ", resultado );

		return resultado;
	}

	async media( pergunta: Pergunta[], topico: Topico, dono: string ) {
		//Aqui atualiza toda a lista de alunos, dando update nas notas de avaliador e postador de todos. 
		//É chamada quando se avalia uma pergunta, com like ou dislike


		var qtd_perg = 0;
		var soma_das_medias = 0;
		var media_total = 0;
		var qtd_lista_avaliacao = 0;
		var qtd_like = 0;
		var qtd_like_media = 0;
		//isso servia pra calcular nota de compartilhador, mas la embaixo tem esse bloco aprimorado
		//deixei pq poderia precisar 

		//for ( var k = 0; k < pergunta.length;k++ ) {
		//	if ( pergunta[k].dono == dono && pergunta[k].avaliacao != null ) {
		//		qtd_perg++;
		//		qtd_like = 0;
		//		if ( pergunta[k].avaliacao == null ) {
		//			qtd_lista_avaliacao = 0;
		//		} else {
		//			qtd_lista_avaliacao = pergunta[k].avaliacao.length;
		//		}
		//		for ( var l = 0; l < qtd_lista_avaliacao; l++ ) {
		//			if ( pergunta[k].avaliacao[l].like == 'Like' ) {
		//				qtd_like = qtd_like + 1;
		//			}
		//		}
		//		if ( qtd_lista_avaliacao == 0 ) {
		//			qtd_lista_avaliacao = 1;
		//		}
		//		var diferenca = this.diferenca_data_topico_para_pergunta( topico.data_inicio, topico.data_fim, pergunta[i].data_criacao );
				
		//		var peso_compartilhador = 0.5 + 0.5 * diferenca;
		//		if( diferenca < 0 ){
		//			peso_compartilhador = 0.5;
		//		}
		//		console.log("Peso compartilhador: ",peso_compartilhador);
		//		if ( qtd_perg < this.turma.lista[i].lista_topico[j].qtd_esperada ) {
		//			var fator = 1;
		//		} else {
		//			var fator = 1 / ((this.turma.lista[i].lista_topico[j].qtd_questoes - this.turma.lista[i].lista_topico[j].qtd_esperada) + 3);
		//		}
		//		console.log("Fator: ", fator);	

		//		qtd_like_media = (qtd_like*peso_compartilhador*fator) / qtd_lista_avaliacao;
		//		soma_das_medias = soma_das_medias + qtd_like_media;
		//	}
		//}

		//1+1+0,9+0,20=3,15


		// esse for serve pra achar o dono da pergunta e atualizar a nota de compartilhador dele
		// os pesos aplicados aqui são o do tempo que a pergunta foi postada e se foi excedente ao numero de perguntas pedido
		for ( var i = 0; i < this.turma.lista.length; i++ ) {
			if ( this.turma.lista[i].id_aluno == dono ) {
				for ( var j = 0; j < this.turma.lista[i].lista_topico.length; j++ ) {
					if ( this.turma.lista[i].lista_topico[j].nome_topico == topico.title ) {
						for ( var k = 0; k < pergunta.length; k++ ) {
							if ( pergunta[k].dono == dono && pergunta[k].avaliacao != null ) {
								//FORs aninhados pra percorrer toda a lista de turmas/topicos/perguntas
								console.log("Pergunta: ",pergunta[k].texto);
								qtd_perg++;
								qtd_like = 0;
								if ( pergunta[k].avaliacao == null ) {
									qtd_lista_avaliacao = 0;
								} else {
									qtd_lista_avaliacao = pergunta[k].avaliacao.length;
								}
								for ( var l = 0; l < qtd_lista_avaliacao; l++ ) {
									if ( pergunta[k].avaliacao[l].like == 'Like' ) {
										qtd_like = qtd_like + 1;
									}
								}
								if ( qtd_lista_avaliacao == 0 ) {
									qtd_lista_avaliacao = 1;
								}
								var diferenca = this.diferenca_data_topico_para_pergunta( topico.data_inicio, topico.data_fim, pergunta[k].data_criacao );

								console.log("Diferenca de dias: ", diferenca);

								//aplica o peso do tempo
								var peso_compartilhador = 0.5 + 0.5 * diferenca;
								if ( peso_compartilhador < 0.5 ) {
									peso_compartilhador = 0.5;
								}

								console.log( "Peso compartilhador: ", peso_compartilhador );

								//Aqui aplica o peso de questões excedentes
								if ( qtd_perg <= this.turma.lista[i].lista_topico[j].qtd_esperada ) {
									var fator = 1;
								} else {
									var fator = 1 / ( ( this.turma.lista[i].lista_topico[j].qtd_questoes - this.turma.lista[i].lista_topico[j].qtd_esperada ) + 3 );
								}
								console.log( "Fator: ", fator );
								console.log( "Qtd Likes: ", qtd_like );
								console.log( "Qtd lista de avaliacao: ",qtd_lista_avaliacao );

								qtd_like_media = ( qtd_like * peso_compartilhador * fator ) / qtd_lista_avaliacao;
								soma_das_medias = soma_das_medias + qtd_like_media;
								console.log( "Qtd like media: ", qtd_like_media );
								console.log( "Soma: ", soma_das_medias );

							}
						}

						//media_total = soma_das_medias / qtd_perg;
						//Essa era a conta dividindo pela quantidade de perguntas feitas
						//Agora � pela quantidade de perguntas esperadas: Se ele fez menos, recebe menos. Se fez mais, recebe mais
						media_total = soma_das_medias / this.turma.lista[i].lista_topico[j].qtd_esperada;
						console.log( "Media total: ", media_total );
						//atualiza esse aluno
						this.turma.lista[i].lista_topico[j].nota_compartilhador = media_total;
					}
				}
			}
		}



		//aqui pra atualizar nota de avaliador
		var flag_aux = false;
		var nota = 0;
		var r1 = 0;
		var r2 = 0;
		var r_agregado = 0;
		var fator_tempo = 0;
		//percorre lista de alunos
		for ( var i = 0; i < this.turma.lista.length; i++ ) {
			console.log("Avaliacoes do : ",this.turma.lista[i].id_aluno);
			qtd_perg = 0;
			soma_das_medias = 0;
			media_total = 0;
			qtd_lista_avaliacao = 0;
			qtd_like_media = 0;
			r2 = 0;
			//percorre lista de perguntas
			for ( var j = 0; j < pergunta.length; j++ ) {
				console.log("Pergunta: ", pergunta[j].texto);
				flag_aux = false;
				qtd_like = 0;
				r1 = 0;
				r_agregado = 0;
				nota = 0;
				if ( pergunta[j].avaliacao == null ) {
					qtd_lista_avaliacao = 0;
				} else {
					qtd_lista_avaliacao = pergunta[j].avaliacao.length;
				}
				for ( var k = 0; k < qtd_lista_avaliacao; k++ ) {
					if ( pergunta[j].avaliacao[k].like == 'Like' ) {
						qtd_like = qtd_like + 1;
					}
					if ( pergunta[j].avaliacao[k].dono == this.turma.lista[i].id_aluno ) {
						flag_aux = true;
						qtd_perg++;
						fator_tempo = this.diferenca_data_topico_para_pergunta( pergunta[j].data_criacao, topico.data_fim, pergunta[j].avaliacao[k].data_nota );
						console.log( "fator tempo: ", fator_tempo );
						if ( pergunta[j].avaliacao[k].like == 'Like' ) {
							nota++;
						}
					}
				}
				//descobre a media atual da pergunta
				if ( qtd_lista_avaliacao == 0 ) {
					qtd_like_media = 0.5;
				} else {
					qtd_like_media = qtd_like / qtd_lista_avaliacao;
				}
				//manhazinha pra tornar o numero positivo
				if ( flag_aux ) {
					r1 = nota - qtd_like_media;
					if ( r1 < 0 ) {
						r1 = r1 * -1;
					}

					r_agregado = 1 - r1;

				}

				//calcula o peso tempo
				var peso_avaliador = 0.5 + 0.5 * fator_tempo;
				if ( peso_avaliador < 0.5 ) {
					peso_avaliador = 0.5;
				}

				console.log("Nota agregando: ", r_agregado);
				console.log("Peso de avaliador: ",peso_avaliador);

				//fator_tempo = this.diferenca_data_topico_para_pergunta( topico.data_inicio, topico.data_fim,  );
				//aplica o peso tempo
				r2 = r2 + r_agregado * peso_avaliador;
				console.log("R2: ",r2);
			}
			if ( qtd_perg == 0 ) {
				qtd_perg = 1;
			}
			media_total = r2 / qtd_perg;
			console.log("Media total: ",media_total);
			//aqui atualiza a lista
			for ( var m = 0; m < this.turma.lista[i].lista_topico.length; m++ ) {
				if ( this.turma.lista[i].lista_topico[m].nome_topico == this.topico.title ) {
					this.turma.lista[i].lista_topico[m].nota_avaliador = media_total;
				}
			}
		}
		//aqui atualiza tudo no banco de uma vez
		await this.turmaService.updateTurma( this.turma );

	}

}

