import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, ModalController, PopoverController, NavParams } from '@ionic/angular';
import { AlertOptions, LoadingOptions, ToastOptions, ModalOptions, PopoverOptions } from '@ionic/core';
import { TurmaLoginComponent } from 'src/app/turmas/components/turma-login/turma-login.component';
import { TurmaLoginPage } from 'src/app/turmas/pages/turma-login/turma-login.page';

@Injectable( {
	providedIn: 'root'
} )
export class OverlayService {

	constructor(
		private alertCtrl: AlertController,
		private loadingCtrl: LoadingController,
		private toastCtrl: ToastController,
		private modalCtrl: ModalController,
		private popoverCtrl: PopoverController
	) { }

	async alert( options?: AlertOptions ): Promise<HTMLIonAlertElement> {
		const alert = await this.alertCtrl.create( options );
		await alert.present();
		return alert;
	}

	async popover( password: string, eve?: Event ): Promise<HTMLIonPopoverElement> {

		const popover = await this.popoverCtrl.create( {
			component: TurmaLoginPage,
			componentProps: {
				pass: password,
			}
		} );

		await popover.present();
		return popover;

	}

	async modal( options?: ModalOptions ): Promise<HTMLIonModalElement> {
		const modal = await this.modalCtrl.create( {
			animated: true,
			backdropDismiss: true,
			component: 'app-minhasturmas-item',

			...options
		} );
		await modal.present();
		return modal;
	}

	async loading( options?: LoadingOptions ): Promise<HTMLIonLoadingElement> {
		const loading = await this.loadingCtrl.create( {
			message: 'Loading...',
			...options
		} );
		await loading.present();
		return loading;
	}

	async toast( options?: ToastOptions ): Promise<HTMLIonToastElement> {
		const toast = await this.toastCtrl.create( {
			position: 'top',
			duration: 2000,
			showCloseButton: true,
			closeButtonText: 'Ok',
			...options
		} );
		await toast.present();
		return toast;
	}
}