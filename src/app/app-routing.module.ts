import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'home', loadChildren: './home/tasks.module#TasksModule' },
	{ path: 'login', loadChildren: './auth/auth.module#AuthModule' },
	{ path: 'tasks', loadChildren: './tasks/tasks.module#TasksModule' },
	{ path: 'turmas', loadChildren: './turmas/turmas.module#TurmasModule' },
	{ path: 'turmas/:id/topicos', loadChildren: './topicos/topicos.module#TopicosModule' },
	{ path: 'turmas/:id/topicos/:idd/perguntas', loadChildren: './perguntas/perguntas.module#PerguntasModule' },
	{ path: 'minhasturmas', loadChildren: './minhasturmas/minhasturmas.module#MinhasturmasModule' },
	{ path: 'perfil', loadChildren: './perfil/perfil.module#PerfilModule' }



	//,canLoad: [AuthGuard]
];

@NgModule( {
	imports: [
		RouterModule.forRoot( routes, { preloadingStrategy: PreloadAllModules } )
	],
	exports: [RouterModule]
} )
export class AppRoutingModule { }
