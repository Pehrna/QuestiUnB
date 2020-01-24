import { NgModule } from '@angular/core';
import { PerfilItemComponent } from './perfil-item/perfil-item.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule( {
	declarations: [PerfilItemComponent],
	imports: [SharedModule],
	exports: [PerfilItemComponent]
} )
export class ComponentModule { }
