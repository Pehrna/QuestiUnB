import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
//	{ path: '', loadChildren:'./login/login.module#LoginPageModule' }
	{ path: '', loadChildren:'src/app/auth/pages/login/login.module#LoginPageModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
