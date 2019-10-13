import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		canActivateChild: [AuthGuard],
		children: [
			{
				path: 'editarTopico/:id',
				loadChildren: './pages/topico-save/topico-save.module#TopicoSavePageModule'
			},
			{
				path: 'criarTopico',
				loadChildren: './pages/topico-save/topico-save.module#TopicoSavePageModule'
			},
			{
				path: '',
				loadChildren: './pages/topicos-list/topicos-list.module#TopicosListPageModule'
			}


		]
	}


];

@NgModule( {
	imports: [RouterModule.forChild( routes )],
	exports: [RouterModule]
} )
export class TopicosRoutingModule { }
