import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicosListPage } from './topicos-list.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';

const routes: Routes = [
	{
		path: '',
		component: TopicosListPage
	}
];

@NgModule( {
	imports: [
		SharedModule,
		ComponentsModule,
		RouterModule.forChild( routes )
	],
	declarations: [TopicosListPage]
} )
export class TopicosListPageModule { }
