import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return next.handle(req).pipe(
     catchError((error: HttpErrorResponse) => {
       console.error('An error occurred:', error.message);
       return throwError(error);
     })
   );
 }
}