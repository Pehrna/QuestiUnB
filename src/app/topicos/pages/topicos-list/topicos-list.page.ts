import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Topico } from '../../models/topico.model';
import { TopicosService } from '../../services/topicos.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Dado } from 'src/app/auth/pages/auth.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginService } from 'src/app/core/services/service.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Turma } from 'src/app/turmas/Models/Turmas.models';
import { TurmasService } from 'src/app/turmas/services/turmas.service';


@Component( {
	selector: 'app-topicos-list',
	templateUrl: './topicos-list.page.html',
	styleUrls: ['./topicos-list.page.scss'],
} )
export class TopicosListPage implements OnInit {
	usuario: Dado = { id: '', nome: '', matricula: '', email: '', professor: false };
	usuario$: Observable<Dado>;
	user: firebase.User;
	id_turma: string;
	topicos$: Observable<Topico[]>;
	topicos: Topico[];
	turma$: Observable<Turma>;
	turma: Turma;

	constructor( private topicosService: TopicosService,
		private turmaService: TurmasService,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private serviceService: LoginService,
		private authService: AuthService,
		private overlayService: OverlayService
	) { }

	async ngOnInit(): Promise<void> {
		const loading = await this.overlayService.loading( {
			message: 'Carregando...'
		} );
		try {
			await this.authService.authState$.subscribe( user => {
				this.user = user
			} );
			this.id_turma = this.activatedRoute.snapshot.paramMap.get( 'id' );
			await this.topicosService.id_Turma( this.id_turma );
			this.topicos$ = this.topicosService.getAll();
			await this.topicos$.subscribe( topic => {
				this.topicos = topic;
			} )
			this.turma$ = this.turmaService.getTurma( this.id_turma );
			await this.turma$.subscribe( turm => {
				this.turma = turm;
			} );
			this.usuario$ = this.serviceService.get( this.user.uid );
			await this.usuario$.subscribe( usu => {
				this.usuario = usu;
				//for ( var i = 0; i < this.topicos.length; i++ ) {
				//	var aux = false;
				//	var cont = 0;
				//	for ( var j = 0; j < this.turma.lista.length; j++ ) {
				//		for ( var k = 0; k < this.turma.lista[j].lista_topico.length;k++) {
				//			if ( this.turma.lista[j].lista_topico[k].nome_topico == this.topicos[i].title ) {
				//				cont++;
				//			}
				//		}
				//	}
				//}
			} );
		} catch ( error ) {
			console.log( 'Erro: ', error )
		} finally {
			loading.dismiss();
		}

	}


	onSelect( topico: Topico ): void {
		this.navCtrl.navigateForward( '/turmas/' + this.id_turma + '/topicos/' + topico.id + '/perguntas' );


	}




}
