import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { PerfilPage } from './perfil.page';

const routes: Routes = [
	{
		path: '',
		component: PerfilPage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild( routes )
	],
	declarations: [PerfilPage]
} )
export class PerfilPageModule { }
