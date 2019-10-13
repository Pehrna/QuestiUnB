import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { SharedModule } from '../shared/shared/shared.module';

//Aula 70

const routes: Routes = [
	{
		path: '',
		canActivateChild: [AuthGuard],
		children: [
			{
				path: 'editarTurma/:id',
				loadChildren: './pages/turma-save/turma-save.module#TurmaSavePageModule'
			},
			{
				path: 'criarTurma',
				loadChildren: './pages/turma-save/turma-save.module#TurmaSavePageModule'
			},
			{
				path: '',
				loadChildren: './pages/turmas-list/turmas-list.module#TurmasListPageModule'
			},
		]
	},
	{ path: 'turma-save', loadChildren: './pages/turma-save/turma-save.module#TurmaSavePageModule' },
	{ path: 'turma-login', loadChildren: './pages/turma-login/turma-login.module#TurmaLoginPageModule' }


];

@NgModule( {
	imports: [SharedModule, RouterModule.forChild( routes )],
	exports: [RouterModule]
} )
export class TurmasRoutingModule { }
