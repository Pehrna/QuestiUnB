import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MinhasturmasListPage } from './minhasturmas-list.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { MinhasTurmasComponentsModule } from '../../components/minhasturmascomponents.module';

const routes: Routes = [
	{
		path: '',
		component: MinhasturmasListPage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		MinhasTurmasComponentsModule,
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild( routes )
	],
	declarations: [MinhasturmasListPage]
} )
export class MinhasturmasListPageModule { }
