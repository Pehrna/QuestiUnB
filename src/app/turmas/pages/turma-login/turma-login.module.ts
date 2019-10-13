import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TurmaLoginPage } from './turma-login.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

const routes: Routes = [
	{
		path: '',
		component: TurmaLoginPage
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
	declarations: [
		TurmaLoginPage
	],
	exports: [
		TurmaLoginPage
	]
} )
export class TurmaLoginPageModule { }
