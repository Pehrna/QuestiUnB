import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';


@Component( {
	selector: 'app-task-item',
	//template: '<button (click)="sendMessage()">Send Message</button>',
	templateUrl: './task-item.component.html',
	styleUrls: ['./task-item.component.scss'],
} )
export class TaskItemComponent {

	@Input() task: Task;
	@Output() done = new EventEmitter<Task>();
	@Output() update = new EventEmitter<Task>();
	@Output() delete = new EventEmitter<Task>();

}
