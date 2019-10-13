import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		canActivateChild: [AuthGuard],
		children: [
			{
				path: 'criarPergunta',
				loadChildren: './pages/pergunta-save/pergunta-save.module#PerguntaSavePageModule'
			},
			{
				path: '',
				loadChildren: './pages/perguntas-list/perguntas-list.module#PerguntasListPageModule'
			}
		]
	}


];

@NgModule( {
	imports: [RouterModule.forChild( routes )],
	exports: [RouterModule]
} )
export class PerguntasRoutingModule { }
