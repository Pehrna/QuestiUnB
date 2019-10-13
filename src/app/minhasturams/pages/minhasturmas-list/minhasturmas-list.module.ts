import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MinhasturmasListPage } from './minhasturmas-list.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';


const routes: Routes = [
	{
		path: '',
		component: MinhasturmasListPage
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
	declarations: [MinhasturmasListPage]
} )
export class MinhasturmasListPageModule { }
