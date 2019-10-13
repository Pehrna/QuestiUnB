import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Topico } from '../../models/topico.model';
import { TopicosService } from '../../services/topicos.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Dado } from 'src/app/auth/pages/auth.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginService } from 'src/app/core/services/service.service';


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

	constructor( private topicosService: TopicosService,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private serviceService: LoginService,
		private authService: AuthService
	) { }

	async ngOnInit(): Promise<void> {
		await this.authService.authState$.subscribe( user => {
			this.user = user
		} );
		this.id_turma = this.activatedRoute.snapshot.paramMap.get( 'id' );
		await this.topicosService.id_Turma( this.id_turma );
		this.topicos$ = this.topicosService.getAll();
		this.usuario$ = this.serviceService.get( this.user.uid );
		await this.usuario$.subscribe( usu => {
			this.usuario = usu;
		} );



	}


	onSelect( topico: Topico ): void {
		this.navCtrl.navigateForward( '/turmas/' + this.id_turma + '/topicos/' + topico.id + '/perguntas' );
	}




}
