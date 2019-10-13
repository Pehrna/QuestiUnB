import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { take } from 'rxjs/operators';


@Component( {
	selector: 'app-tasks-list',
	templateUrl: './tasks-list.page.html',
	styleUrls: ['./tasks-list.page.scss'],
} )
export class TasksListPage implements OnInit {

	tasks$: Observable<Task[]>;

	constructor(
		private navCtrl: NavController,
		private tasksService: TasksService,
		private overlayService: OverlayService,
	) { }

	async ngOnInit(): Promise<void> {
		const loading = await this.overlayService.loading();
		this.tasks$ = this.tasksService.getAll();
		this.tasks$.pipe( take( 1 ) ).subscribe( tasks => loading.dismiss() );
	}

	onUpdate( task: Task ): void {
		var b = '/tasks/edit/' + task.id;
		this.navCtrl.navigateForward( b );

	}

	async onDelete( task: Task ): Promise<void> {
		var b = 'Deletar ' + task.title + '?'
		await this.overlayService.alert( {
			message: b,
			buttons: [
				{
					text: 'Sim',
					handler: async () => {
						var b = 'Tarefa ' + task.title;
						await this.tasksService.delete( task );
						await this.overlayService.toast( {
							message: b + ' deletada.'
						} );
					}
				},
				{
					text: 'No'
				}
			]
		} );
	}

	async onDone( task: Task ): Promise<void> {
		var b = 'Tarefa feita!';
		if ( task.done ) {
			b = 'Tarefa desfeita!'
		}
		const taskToUpdate = { ...task, done: !task.done };
		await this.tasksService.update( taskToUpdate );
		await this.overlayService.toast( {
			message: b
		} );
	}

}
