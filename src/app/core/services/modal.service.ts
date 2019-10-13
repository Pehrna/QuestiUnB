import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { AlertOptions, LoadingOptions, ToastOptions, ModalOptions } from '@ionic/core';

@Injectable( {
	providedIn: 'root'
} )
export class ModalService {

	constructor(
		private alertCtrl: AlertController,
		private loadingCtrl: LoadingController,
		private toastCtrl: ToastController,
		private modalCtrl: ModalController
	) { }


}
