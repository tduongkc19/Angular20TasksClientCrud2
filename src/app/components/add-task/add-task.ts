import { Component, ChangeDetectorRef } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-add-task',
  standalone: false,
  templateUrl: './add-task.html',
  styleUrl: './add-task.css'
})

/**
 * @author Tommy Duong, tommy.duong.kc@gmail.com
 * @note Task Client CRUD implementation using Angular 20.
 * @category User Interface
 * @implNote AddTask class is used to add tasks.
 * 
 */
export class AddTask {
	
	private defaultStatus: string = 'Pending';
	
	task: Task = {
	    taskTitle: '',
	    taskDescription: '',
	    taskStatus: this.defaultStatus
	  };
	  
	  submitted = false;
	
	  constructor(private taskService: TaskService, private cdf: ChangeDetectorRef) { }

	   saveTask(): void {
		
	     const data = {
	       taskTitle: this.task.taskTitle,
	       taskDescription: this.task.taskDescription
	     };
		 
		 console.log("add-task.saveTask()...data: ", data);

	     this.taskService.create(data)
	       .subscribe({
	         next: (res) => {
			   console.log("add-task.saveTask()...res: ", res);
			   this.cdf.detectChanges(); 
			   this.cdf.markForCheck();
	           this.submitted = true;

	         },
	         error: (e) => console.error(e)
	       });
	   }

	   newTask(): void {
	     this.submitted = false;
	     this.task = {
	       taskTitle: '',
	       taskDescription: '',
	       taskStatus: this.defaultStatus
	     };
	   }
	  
	  
}
