import { NgModule } from '@angular/core';
import { TopicoItemComponent } from './topico-item/topico-item.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule( {
	declarations: [
		TopicoItemComponent
	],
	imports: [
		SharedModule
	],
	exports: [
		TopicoItemComponent
	]
} )
export class ComponentsModule { }
