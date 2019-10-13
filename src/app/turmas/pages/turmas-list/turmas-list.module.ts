import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TurmasListPage } from './turmas-list.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { TurmaComponentsModule } from '../../components/turmacomponents.module';

const routes: Routes = [
	{
		path: '',
		component: TurmasListPage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		TurmaComponentsModule,
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild( routes )
	],
	declarations: [TurmasListPage]
} )
export class TurmasListPageModule { }
