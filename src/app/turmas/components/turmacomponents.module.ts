import { NgModule } from '@angular/core';
import { TurmaItemComponent } from './turma-item/turma-item.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule( {
	declarations: [
		TurmaItemComponent
		
	],
	imports: [
		SharedModule
	],
	exports: [
		TurmaItemComponent
		
	]
} )
export class TurmaComponentsModule { }
