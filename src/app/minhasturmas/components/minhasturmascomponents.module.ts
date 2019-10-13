import { NgModule } from '@angular/core';
import { MinhasTurmasItemComponent } from 'src/app/minhasturmas/components/minhasturmas-item/minhasturmas-item.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule( {
	declarations: [
		MinhasTurmasItemComponent
	],
	imports: [
		SharedModule
	],
	exports: [
		MinhasTurmasItemComponent
	]
} )
export class MinhasTurmasComponentsModule { }
