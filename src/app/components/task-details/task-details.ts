import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
	selector: 'app-task-details',
	standalone: false,
	templateUrl: './task-details.html',
	styleUrl: './task-details.css'
})

/**
 * @author Tommy Duong, tommy.duong.kc@gmail.com
 * @note Task Client CRUD implementation using Angular 20.
 * @category User Interface
 * @implNote TaskDetails class is used to edit, update, and delete tasks.
 * 
 */
export class TaskDetails implements OnInit {

	//default state is not to show at start.
	showEdit = false;
	dataSubject = new BehaviorSubject<any>(null);
	currentStatus: String ='';

	@Input() viewMode = false;

	@Input() currentTask: Task = {
		taskTitle: '',
		taskDescription: '',
		taskStatus: ''
	};

	message = '';

	constructor(
		private taskService: TaskService,
		private route: ActivatedRoute,
		private router: Router,
		private cdf: ChangeDetectorRef) { }


	ngOnInit(): void {
		console.log("task-details.ngOnInit().execution started...viewMode:", this.viewMode);
		if (!this.viewMode) {
			this.message = '';
			this.getTask(this.route.snapshot.params["id"]);
		}
	}

	getTask(id: string): void {
		console.log("task-details.getTask().execution started...ID: ", id);

		this.taskService.get(id)
			.subscribe({
				next: (data) => {
					this.currentTask = data;
					this.reloadData();
					this.showEdit = true;
					console.log("task-details.getTask()...currentTask: ", this.currentTask);
					this.cdf.detectChanges();
					this.cdf.markForCheck();

				},
				error: (e) => console.error(e)
				
			});
	}

	reloadData() {
		console.log("task-details.reloadData().execution started...this.currentTask: ", this.currentTask);
		// Fetch new data and emit it
		this.dataSubject.next(this.currentTask);
	}

	// Update task status & task.
	updateStatus(): void {
		console.log("task-details.updateStatus().execution started...status: ", this.currentTask.taskStatus);
		this.currentStatus = this.currentTask.taskStatus || 'Pending';

		const data = {
			taskTitle:this.currentTask.taskTitle,
			taskDescription:this.currentTask.taskDescription,
			taskStatus:this.currentStatus
		};

		this.message = '';

		this.taskService.update(this.currentTask.taskId, data)
			.subscribe({
				next: (res) => {
					console.log(res);
					this.currentTask.taskStatus = res.taskStatus;
					this.message = res.message ? res.message : 'The status was updated successfully!';
					this.cdf.detectChanges();
					this.cdf.markForCheck();
				},
				error: (e) => console.log("task-details.updateStatus()...error: ",
								this.message = 'Task not found...This task has been deleted!' , e)
			});
	}
	
	// Assigns a task to a specific user.
	assignTask(): void {
		console.log("task-details.assignTask().execution started...");
		this.updateStatus();
	}

	updateTask(): void {
		console.log("task-details.updateTask().execution started...");
		this.message = '';

		this.taskService.update(this.currentTask.taskId, this.currentTask)
			.subscribe({
				next: (res) => {
					console.log(res);
					this.message = res.message ? res.message : 'This task was updated successfully!';
					this.cdf.detectChanges();
					this.cdf.markForCheck();
				},
				error: (e) => console.log("task-details.updateTask()...error: ",
								this.message = 'Task not found...This task has been deleted!', e)
			});
	}

	deleteTask(): void {
		console.log("task-details.deleteTask().execution started...");
		this.message = '';
		this.taskService.delete(this.currentTask.taskId)
			.subscribe({
				next: (res) => {
					console.log("task-details.deleteTask()...res: ", res);
					this.message = 'This task was deleted successfully!';
					this.cdf.detectChanges();
					this.cdf.markForCheck();
					this.router.navigate(['/task']);
				},

				error: (e) => console.log("task-details.deleteTask()...error: ",
								this.message = 'This task has been deleted!' , e)
				


			});


	}

}
