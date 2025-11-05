import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Constants } from '../models/constants';



@Injectable({
  providedIn: 'root'
})

/**
 * @author Tommy Duong, tommy.duong.kc@gmail.com
 * @note Task Client CRUD implementation using Angular 20.
 * @category User Interface
 * @implNote TaskService class is used to provide service calls to the APIs, 
 * such as retrieving, updating, creating, and deleting tasks.
 * 
 */
export class TaskService implements OnInit {
	
	private baseUrl = 'http://localhost:8080/api/v1/tasks';
  
	constructor(private http: HttpClient) { }
	
	ngOnInit() {

		const token = localStorage.getItem('token'); // Fetch token dynamically
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
		const apiUrl = 'http://localhost:8080/api/v1/tasks'; // Replace with your API URL
		console.log('Debug:services.task.ngOnInit()...token: ', token);
		
		this.http.get(apiUrl, { headers }).subscribe(
			(response) => {
				console.log('Debug:services.task.ngOnInit()...API Response:', response);
			},
			(error) => {
				console.error('Debug:services.task.ngOnInit()...API Error:', error);
			}
		);
	}
	
	getAllPaginated(): Observable<Task[]> {
	  return this.http.get<Task[]>(`${this.baseUrl}/task-pages`);
	}
	
	getPaginatedTasks(page: number, itemsPerPage: number): Observable<any> {
	  const params = new HttpParams()
	  .set('page', page.toString())
	  .set('size', itemsPerPage.toString());

	  return this.http.get<any>(this.baseUrl + '/task-pages', { params });
	}
	
	getAll(): Observable<Task[]> {
	  return this.http.get<Task[]>(this.baseUrl);
	}

	get(id: any): Observable<Task> {
	  return this.http.get<Task>(`${this.baseUrl}/${id}`);
	}

	create(data: any): Observable<any> {
	  console.log('TaskService JSON create.request = ', JSON.stringify(data));	
	  return this.http.post(this.baseUrl, data);
	}

	update(id: any, data: any): Observable<any> {
	  return this.http.put(`${this.baseUrl}/${id}`, data);
	}

	delete(id: any): Observable<void> {
	  return this.http.delete<void>(`${this.baseUrl}/${id}`);
	}

	deleteAll(): Observable<any> {
	  return this.http.delete(this.baseUrl);
	}

	findByTitle(title: any): Observable<Task[]> {
	  return this.http.get<Task[]>(`${this.baseUrl}/search?title=${title}`);
	}
	
	findByTitlePages(title: any): Observable<Task[]> {
	  return this.http.get<Task[]>(`${this.baseUrl}/search-pages?title=${title}`);
	}
	
	findByTitlePaginatedTasks(title: string, page: number, itemsPerPage: number): Observable<any> {
	  const params = new HttpParams()
	  .set('title', title)
	  .set('page', page.toString())
	  .set('size', itemsPerPage.toString());
	  return this.http.get<any>(this.baseUrl + '/search-pages', { params });
	}
}
