import { NgModule } from '@angular/core';
import { TurmaItemComponent } from './turma-item/turma-item.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { TurmaLoginComponent } from './turma-login/turma-login.component';

@NgModule( {
	declarations: [
		TurmaItemComponent,
		TurmaLoginComponent
		
	],
	imports: [
		SharedModule
	],
	exports: [
		TurmaItemComponent,
		TurmaLoginComponent
		
	]
} )
export class TurmaComponentsModule { }
