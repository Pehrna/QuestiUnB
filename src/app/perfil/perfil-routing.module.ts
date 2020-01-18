import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';


const routes: Routes = [
	{
		path: '',
		canActivateChild: [AuthGuard],
		children: [
			{
				path: '',
				loadChildren: './pages/perfil/perfil.module#PerfilPageModule'
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
