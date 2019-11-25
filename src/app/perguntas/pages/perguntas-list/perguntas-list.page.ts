import { Component, OnInit } from '@angular/core';
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

	async onAvaliarBem( pergunta: Pergunta ): Promise<void> {


		const loading = await this.overlayService.loading( {
			message: 'Atualizando...'
		} );
		try {
			await this.authService.authState$.subscribe( user => {
				this.user = user
			} );

			var time = new Date();
			this.aval = pergunta.avaliacao;
			if ( this.aval == null ) {
				this.aval = [{ id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Like', data_nota: time }];
				const pergunta_aval = { ...pergunta, avaliacao: this.aval };
				await this.perguntaService.update( pergunta_aval );
				this.media( this.perg, pergunta.dono );
				return;
			}

			for ( var i = 0; i < this.aval.length; i++ ) {
				if ( this.aval[i].dono == this.user.uid ) {
					await this.overlayService.toast( {
						message: 'Essa pergunta já foi avaliada!'
					} );
					return;
				}
			}

			this.aval.push( { id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Like', data_nota: time } );
			const pergunta_aval = { ...pergunta, avaliacao: this.aval };
			await this.perguntaService.update( pergunta_aval );
			this.media( this.perg, pergunta.dono );
		}
		catch ( error ) {
			console.log( error );
		} finally {
			loading.dismiss();
		}
	}



	async onAvaliarMal( pergunta: Pergunta ): Promise<void> {

		const loading = await this.overlayService.loading( {
			message: 'Atualizando...'
		} );
		try {
			await this.authService.authState$.subscribe( user => {
				this.user = user
			} );

			this.aval = pergunta.avaliacao;
			var time = new Date();

			if ( this.aval == null ) {
				this.aval = [{ id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Dislike', data_nota: time }];
				const pergunta_aval = { ...pergunta, avaliacao: this.aval };
				await this.perguntaService.update( pergunta_aval );
				this.media( this.perg, pergunta.dono );
				return;
			}

			for ( var i = 0; i < this.aval.length; i++ ) {
				if ( this.aval[i].dono == this.user.uid ) {
					await this.overlayService.toast( {
						message: 'Essa pergunta já foi avaliada!'
					} );
					return;
				}
			}

			this.aval.push( { id: this.db.createId(), dono: this.user.uid, dono_nome: this.user.displayName, like: 'Dislike', data_nota: time } );
			const pergunta_aval = { ...pergunta, avaliacao: this.aval };
			await this.perguntaService.update( pergunta_aval );
			this.media( this.perg, pergunta.dono );
		}
		catch ( error ) {
			console.log( error );
		} finally {
			loading.dismiss();
		}
	}

	async media( pergunta: Pergunta[], dono: string ) {


		var qtd_perg = 0;
		var soma_das_medias = 0;
		var media_total = 0;
		var qtd_lista_avaliacao = 0;
		var qtd_like = 0;
		var qtd_like_media = 0;
		//isso serve pra calcular nota de compartilhador	

		for ( var i = 0; i < pergunta.length; i++ ) {
			if ( pergunta[i].dono == dono && pergunta[i].avaliacao != null ) {
				qtd_perg++;
				qtd_like = 0;
				if ( pergunta[i].avaliacao == null ) {
					qtd_lista_avaliacao = 0;
				} else {
					qtd_lista_avaliacao = pergunta[i].avaliacao.length;
				}
				for ( var j = 0; j < qtd_lista_avaliacao; j++ ) {
					if ( pergunta[i].avaliacao[j].like == 'Like' ) {
						qtd_like = qtd_like + 1;
					}
				}
				if ( qtd_lista_avaliacao == 0 ) {
					qtd_lista_avaliacao = 1;
				}
				qtd_like_media = qtd_like / qtd_lista_avaliacao;
				soma_das_medias = soma_das_medias + qtd_like_media;
			}
		}

		// esse for serve pra achar o dono da pergunta e atualizar a nota de compartilhador dele
		for ( var i = 0; i < this.turma.lista.length; i++ ) {
			if ( this.turma.lista[i].id_aluno == dono ) {
				for ( var j = 0; j < this.turma.lista[i].lista_topico.length; j++ ) {
					if ( this.turma.lista[i].lista_topico[j].nome_topico == this.topico.title ) {
						//media_total = soma_das_medias / qtd_perg;
						//Essa era a conta dividindo pela quantidade de perguntas feitas
						//Agora é pela quantidade de erguntas esperadas: Se ele fez menos, recebe menos. Se fez mais, recebe mais
						media_total = soma_das_medias / this.turma.lista[i].lista_topico[j].qtd_esperada;
						this.turma.lista[i].lista_topico[j].nota_compartilhador = media_total;
					}
				}
			}
		}


		console.log( "NOTA DE AVALIADOR:" );
		console.log( "NOTA DE AVALIADOR:" );
		console.log( "NOTA DE AVALIADOR:" );
		console.log( "NOTA DE AVALIADOR:" );
		console.log( "NOTA DE AVALIADOR:" );
		console.log( "NOTA DE AVALIADOR:" );
		console.log( "NOTA DE AVALIADOR:" );
		console.log( "NOTA DE AVALIADOR:" );

		//aqui pra atualizar noda de avaliador
		var flag_aux = false;
		var nota = 0;
		var r1 = 0;
		var r2 = 0;
		var r_agregado = 0;
		//percorre lista de alunos
		for ( var i = 0; i < this.turma.lista.length; i++ ) {
			console.log( "AVALIADOR ", i + 1, ": ", this.turma.lista[i].id_aluno );
			qtd_perg = 0;
			soma_das_medias = 0;
			media_total = 0;
			qtd_lista_avaliacao = 0;
			qtd_like = 0;
			qtd_like_media = 0;
			flag_aux = false;
			nota = 0;
			r1 = 0;
			r2 = 0;
			r_agregado = 0;

			console.log( "Pergunta: ", pergunta );
			for ( var j = 0; j < pergunta.length; j++ ) {
				console.log( "Pergunta ", j + 1, ": ", pergunta[j].texto );
				flag_aux = false;
				qtd_like = 0;
				r1 = 0;
				r_agregado = 0;
				nota = 0;
				console.log( "Qtd_likes, r1 e nota recebem 0 pois começamos agora a colher informações dos likes dessa pergunta" );
				if ( pergunta[j].avaliacao == null ) {
					qtd_lista_avaliacao = 0;
				} else {
					qtd_lista_avaliacao = pergunta[j].avaliacao.length;
				}
				for ( var k = 0; k < qtd_lista_avaliacao; k++ ) {
					console.log( "	Se tem avaliações, entra aqui. " );
					console.log( "	Pergunta: ", j + 1, ", Avaliacao ", k + 1, ": ", pergunta[j].avaliacao[k].like );
					console.log( "Dono: ", pergunta[j].avaliacao[k].dono );
					if ( pergunta[j].avaliacao[k].like == 'Like' ) {
						console.log( "		Aqui começa a contagem de likes dessa perguntana posicao [j]. " );
						qtd_like = qtd_like + 1;
					}
					if ( pergunta[j].avaliacao[k].dono == this.turma.lista[i].id_aluno ) {
						console.log( "		Mesmo ID dono e do aluno testado. A flag_aux vira true, a qtd_de_perg ++, e se for um like, qtd_like++" );
						flag_aux = true;
						qtd_perg++;
						if ( pergunta[j].avaliacao[k].like == 'Like' ) {
							nota++;
						}
					}
				}
				if ( qtd_lista_avaliacao == 0 ) {
					console.log( "Caso qtd_lista_avaliacao seja 0 (Ou seja, nao haja avaliaçoes), ele recebe 0,5 pra efeitos de calculo" );
					qtd_like_media = 0.5;
				} else {
					qtd_like_media = qtd_like / qtd_lista_avaliacao;
				}
				console.log( "Qtd_like: ", qtd_like );
				console.log( "qtd_lista_avaliacao: ", qtd_lista_avaliacao );
				console.log( "Qtd_like_media: ", qtd_like_media );
				if ( flag_aux ) {
					console.log( "				Se flag_aux for true, o aluno avaliou essa e vai entrar pra uma conta envolvendo RI" );
					r1 = nota - qtd_like_media;
					console.log( "				Nota: ", nota );
					console.log( "				Qtd_like_media: ", qtd_like_media );
					console.log( "				R1: ", r1 );
					if ( r1 < 0 ) {
						console.log( "Se for negativo" );
						r1 = r1 * -1;
					}

					r_agregado = 1 - r1;
					console.log( "R_agregado: ", r_agregado );

				}
				console.log( "R2 fica sendo um agregador de RIs" );
				console.log( "R2 antes: ", r2 );
				console.log( "R_agregado: ", r_agregado );
				console.log( "R2 depois: ", r_agregado + r2 );
				r2 = r2 + r_agregado;
				//aqui é aplicada o peso do tempo
			}
			if ( qtd_perg == 0 ) {
				qtd_perg = 1;
			}
			console.log( "Fora do for das perguntas, quando ele percorreu todas elas, faz a media" );
			media_total = r2 / qtd_perg;
			console.log( "qtd_perg: ", qtd_perg );
			console.log( "R2: ", r2 );
			console.log( "media total: ", media_total );

			for ( var m = 0; m < this.turma.lista[i].lista_topico.length; m++ ) {
				if ( this.turma.lista[i].lista_topico[m].nome_topico == this.topico.title ) {
					this.turma.lista[i].lista_topico[m].nota_avaliador = media_total;
				}
			}
		}

		await this.turmaService.updateTurma( this.turma );

	}

}

