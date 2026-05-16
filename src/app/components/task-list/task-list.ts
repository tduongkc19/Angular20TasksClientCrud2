import { Component, OnInit, ChangeDetectorRef, signal, HostListener } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-task-list',
	standalone: false,
	templateUrl: './task-list.html',
	styleUrl: './task-list.css'
})

/**
 * @author Tommy Duong, tommy.duong.kc@gmail.com
 * @note Task Client CRUD implementation using Angular 20.
 * @category User Interface
 * @implNote TaskList class used to retrieve and search tasks.
 * 
 */
export class TaskList implements OnInit {


	tasks: Task[] = []; // Array to hold fetched tasks
	currentTask: Task = {};
	currentIndex = -1;
	title = '';
	//default state is not to show at start.
	show = false;
	loading = true; // Flag to indicate loading state
	error: string | null = null; // Variable to hold error message
	message = ''; // 
	// Pagination Settings
	currentPage: number = 0;
	totalPages: number = 0;
	itemsPerPage: number = 5;
	totalItems: number = 0;
	pageSizeOptions: number[] = [5, 10, 20, 50, 100];
	selectedRow: number | null = null;


	constructor(private taskService: TaskService, private cdf: ChangeDetectorRef) { }

	ngOnInit(): void {
		//this.retrieveTasks();
		this.retrieveTasksPagination();
	}

	//-----------------------------------------

	retrieveTasksPagination(): void {
		console.log('task-list.retrieveTasksPagination().execution started...');
		this.message = 'Loading tasks...';
		this.taskService.getPaginatedTasks(this.currentPage, this.itemsPerPage).subscribe(
			(responseData) => {
				this.tasks = responseData.content;
				this.totalPages = responseData.totalPages;
				this.currentPage = responseData.pageable.pageNumber;
				this.totalItems = responseData.totalElements;
				this.loading = false; // Set loading to false on success
				this.error = null; // Clear any previous error
				// data is ready, show view!
				this.show = true;
				// tell Angular to re-render  
				this.cdf.detectChanges();
				this.cdf.markForCheck();
				console.log('task-list.retrieveTasksPagination()... = ', this.tasks);
				console.log('JSON Response = ', JSON.stringify(this.tasks));
			},
			(error) => {
				this.message = 'Failed to load tasks.';
				console.error(error); // Log the error for debugging
				this.loading = false; // Set loading to false even on error
				this.tasks = []; // Clear tasks array on error
			}


		);
	}

	goToPage(page: number): void {
		this.currentPage = page;
		this.retrieveTasksPagination();
	}

	nextPage(): void {
		if (this.currentPage < this.totalPages - 1) {
			this.currentPage++;
			this.retrieveTasksPagination();
		}
	}

	previousPage(): void {
		if (this.currentPage > 0) {
			this.currentPage--;
			this.retrieveTasksPagination();
		}
	}

	changePageSize(size: number): void {
		this.itemsPerPage = size;
		this.currentPage = 0;
		this.retrieveTasksPagination();
	}

	onPageChange(page: number): void {
		this.currentPage = page;
		this.retrieveTasksPagination();
	}

	get pageNumbers(): number[] {
		return Array.from({ length: this.totalPages }, (_, index) => index);
	}

	getVisiblePages(): number[] {
		const delta = 2; // Number of pages to show on each side of current page

		let start = Math.max(1, this.currentPage - delta);
		let end = Math.min(this.totalPages, this.currentPage + delta);

		// Ensure we always show at least 5 pages if available
		if (end - start < 4) {
			if (start === 1) {
				end = Math.min(this.totalPages, start + 4);
			} else if (end === this.totalPages) {
				start = Math.max(1, end - 4);
			}
		}

		const pages = [];
		for (let i = start - 1; i <= end; i++) {
			pages.push(i);
		}

		return pages;
	}


	//-----------------------------------------
	// Retrieve items with no pagination.
	retrieveTasks(): void {
		this.loading = true; // Set loading to true when component initializes
		this.taskService.getAll()
			.subscribe({
				next: (responseData) => { // Success callback
					this.tasks = responseData; // Assign fetched tasks to component's tasks array
					this.loading = false; // Set loading to false on success
					this.error = null; // Clear any previous error
					// data is ready, show view!
					this.show = true;
					// tell Angular to re-render  
					this.cdf.detectChanges();
					this.cdf.markForCheck();
					console.log(this.tasks);
					console.log('JSON Response = ', JSON.stringify(this.tasks));
				},

				error: (err) => { // Error callback
					this.error = 'Failed to load tasks.'; // Set error message
					console.error('Error fetching tasks:', err); // Log the error for debugging
					this.loading = false; // Set loading to false even on error
					this.tasks = []; // Clear tasks array on error
				}

			});
	}

	refreshList(): void {
		this.retrieveTasks();
		this.currentTask = {};
		this.currentIndex = -1;
	}

	setActiveTask(task: Task, index: number): void {
		this.currentTask = task;
		this.currentIndex = index;
	}


	selectRow(index: number, event: MouseEvent): void {
		event.stopPropagation(); // Prevent the click from propagating to the parent
		this.selectedRow = index;
	}

	clearSelection(event: MouseEvent): void {
		this.selectedRow = null; // Reset the selected row
	}

	removeAllTasks(): void {
		console.log('task-list.removeAllTasks().execution started...');
		this.taskService.deleteAll()
			.subscribe({
				next: (res) => {
					console.log('task-list.removeAllTasks().execution started...res: ', res);
					this.refreshList();
				},
				error: (e) => console.error(e)
			});
	}

	// Search by title.
	searchTitle(): void {
		console.log('task-list.searchTitle().execution started...');
		this.currentTask = {};
		this.currentIndex = -1;

		this.taskService.findByTitle(this.title)
			.subscribe({
				next: (data) => {
					this.tasks = data;
					console.log('task-list.searchTitle().data...', data);
				},
				error: (e) => console.error(e)
			});
	}

	// Search by title with pages.
	searchTitlePages(): void {
		console.log('task-list.searchTitlePages().execution started...');
		this.currentTask = {};
		this.currentIndex = -1;
		this.taskService.findByTitlePaginatedTasks(this.title, this.currentPage, this.itemsPerPage)
			.subscribe({
				next: (data) => {
					console.log('task-list.searchTitlePages().data...', data);
					this.tasks = data.content;
					this.totalPages = data.totalPages;
					this.currentPage = data.pageable.pageNumber;
					this.totalItems = data.totalElements;
					this.loading = false; // Set loading to false on success
					this.error = null; // Clear any previous error
					// data is ready, show view!
					this.show = true;
					// tell Angular to re-render  
					this.cdf.detectChanges();
					this.cdf.markForCheck();
					console.log('JSON Response = ', JSON.stringify(this.tasks));

				},

				error: (e) => console.error(e)

			});

	}

	trackById(index: number, item: any): number {
		return item.id;
	}

	keys(): Array<any> {
		console.log(Object.entries(this.tasks))
		return Object.entries(this.tasks);
	}

	trackByFn(index: number, item: any): number {
		return item.id; // Unique identifier
	}
	
	trackByUniqueId(index: number, item: any): string {
	  return `${item.id}-${index}`; // Unique identifier
	}
}
