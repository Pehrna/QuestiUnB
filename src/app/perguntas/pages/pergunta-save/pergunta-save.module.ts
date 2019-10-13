import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerguntaSavePage } from './pergunta-save.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

const routes: Routes = [
	{
		path: '',
		component: PerguntaSavePage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		RouterModule.forChild( routes )
	],
	declarations: [PerguntaSavePage]
} )
export class PerguntaSavePageModule { }
