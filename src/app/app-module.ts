import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './error-interceptor';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AddTask } from './components/add-task/add-task';
import { TaskDetails } from './components/task-details/task-details';
import { TaskList } from './components/task-list/task-list';


@NgModule({
  declarations: [
    App,
    AddTask,
    TaskDetails,
    TaskList
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	FormsModule
  ],
  providers: [
	{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
	provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
