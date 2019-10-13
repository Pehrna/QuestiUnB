import { NgModule } from '@angular/core';

import { TaskItemComponent } from './task-item/task-item.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule( {
	declarations: [
		TaskItemComponent
	],
	imports: [
		SharedModule
	],
	exports: [
		TaskItemComponent
	]
} )
export class ComponentsModule { }
