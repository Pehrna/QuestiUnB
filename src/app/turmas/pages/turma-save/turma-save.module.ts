import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TurmaSavePage } from './turma-save.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

const routes: Routes = [
	{
		path: '',
		component: TurmaSavePage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		RouterModule.forChild( routes )
	],
	declarations: [TurmaSavePage]
} )
export class TurmaSavePageModule { }
