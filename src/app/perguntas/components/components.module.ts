import { NgModule } from '@angular/core';
import { PerguntaItemComponent } from './pergunta-item/pergunta-item.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule( {
	declarations: [
		PerguntaItemComponent
	],
	imports: [
		SharedModule
	],
	exports: [
		PerguntaItemComponent
	]
} )
export class ComponentsModule { }
