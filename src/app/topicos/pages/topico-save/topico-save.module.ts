import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicoSavePage } from './topico-save.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

const routes: Routes = [
	{
		path: '',
		component: TopicoSavePage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		RouterModule.forChild( routes )
	],
	declarations: [TopicoSavePage]
} )
export class TopicoSavePageModule { }
