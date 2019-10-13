import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskSavePage } from './task-save.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

const routes: Routes = [
	{
		path: '',
		component: TaskSavePage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		RouterModule.forChild( routes )
	],
	declarations: [TaskSavePage]
} )
export class TaskSavePageModule { }
