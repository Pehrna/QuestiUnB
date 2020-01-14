import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthProvider } from 'src/app/core/services/auth.types';
import { __await } from 'tslib';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Dado } from '../auth.model';
import { LoginService } from 'src/app/core/services/service.service';
import * as firebase from 'firebase';
	

@Component( {
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
} )
export class LoginPage implements OnInit {

	usuarioId: string = null;
	usuarioDado = {} as Dado;
	usuarioForm: FormGroup;
	authForm: FormGroup;
	authProviders = AuthProvider;
	configs = {
		isSignIn: true,
		action: 'Login',
		actionChange: 'Criar conta'
	};


	private nameControl = new FormControl( '', [Validators.required, Validators.minLength( 3 )] );
	private matriculaControl = new FormControl( '', [Validators.required, Validators.pattern( '^([0-9]{2}\/[0-9]{7})|([0-9]{9})' )] );

	constructor( private authService: AuthService,
		private loginService: LoginService,
		private fb: FormBuilder,
		private overlayService: OverlayService,
		private navCtrl: NavController,
		private route: ActivatedRoute ) { }

	ngOnInit(): void {
		this.createForm();
	}

	private createForm(): void {
		this.authForm = this.fb.group( {
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength( 6 )]]
		} )
	}

	private createUser( userId: string, userNome: string, userEmail: string, userMatricula: string ): void {

		this.usuarioForm = this.fb.group( {
			id: [userId],
			name: [userNome],
			email: [userEmail],
			matricula: [userMatricula],
			professor: false

		} );
	}

	changeAuthAction(): void {
		this.configs.isSignIn = !this.configs.isSignIn;
		const { isSignIn } = this.configs;
		this.configs.action = isSignIn ? 'Login' : 'Cadastrar';
		this.configs.actionChange = isSignIn ? 'Criar conta' : 'Ja tenho conta'
		!isSignIn ? this.authForm.addControl( 'name', this.nameControl ) : this.authForm.removeControl( 'name' );
		!isSignIn ? this.authForm.addControl( 'matricula', this.matriculaControl ) : this.authForm.removeControl( 'matricula' );
	}

	async onSubmit( provider: AuthProvider ): Promise<void> {
		const loading = await this.overlayService.loading();
		try {			
			const credentials = await this.authService.authenticate( {
				isSignIn: this.configs.isSignIn,
				user: this.authForm.value,
				provider: provider
			} );
			if ( this.authForm.value.matricula != null ) {
				this.createUser( firebase.auth().currentUser.uid, firebase.auth().currentUser.displayName, firebase.auth().currentUser.email, this.authForm.value.matricula );
				const user = await this.loginService.create( this.usuarioForm.value );
			}
			
			this.navCtrl.navigateForward( this.route.snapshot.queryParamMap.get( 'redirect' ) || '/turmas' );
		
		} catch ( e ) {
			console.log( 'Erro: ', e );
			this.overlayService.toast( {
				message: e.message
			} );
		}
		finally {
			loading.dismiss();
		}
	}

	get email(): FormControl {

		return <FormControl>this.authForm.get( 'email' );
	}

	get password(): FormControl {

		return <FormControl>this.authForm.get( 'password' );
	}

	get name(): FormControl {

		return <FormControl>this.authForm.get( 'name' );
	}

	get matricula(): FormControl {

		return <FormControl>this.authForm.get( 'matricula' );
	}
}
