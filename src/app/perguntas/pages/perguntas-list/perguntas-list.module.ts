import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerguntasListPage } from './perguntas-list.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ComponentsModule } from 'src/app/perguntas/components/components.module';

const routes: Routes = [
	{
		path: '',
		component: PerguntasListPage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		ComponentsModule,
		RouterModule.forChild( routes )
	],
	declarations: [PerguntasListPage]
} )
export class PerguntasListPageModule { }
