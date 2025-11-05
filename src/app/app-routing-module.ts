import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddTask } from './components/add-task/add-task';
import { TaskDetails } from './components/task-details/task-details';
import { TaskList } from './components/task-list/task-list';


const routes: Routes = [
	
	{ path: '', redirectTo: 'tasks', pathMatch: 'full' },
	{ path: 'tasks', component: TaskList },
	{ path: 'tasks/:id', component: TaskDetails },
	{ path: 'add', component: AddTask }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
