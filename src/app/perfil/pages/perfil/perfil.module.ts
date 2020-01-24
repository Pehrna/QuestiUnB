import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared/shared.module';

import { PerfilPage } from './perfil.page';
import { PerfilModule } from '../../perfil.module';
import { ComponentModule } from '../../component/component.module'

const routes: Routes = [
	{
		path: '',
		component: PerfilPage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		ComponentModule,
		RouterModule.forChild( routes )
	],
	declarations: [PerfilPage]
} )
export class PerfilPageModule { }
