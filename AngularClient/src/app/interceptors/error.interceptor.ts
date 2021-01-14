import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if(error) {
          switch (error.status) {
            case 400:
              if(error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                this.snackBar.open(modalStateErrors.join(), 'OK');
                throw modalStateErrors.flat();
              } else {
                this.snackBar.open(error.error + ' ' + error.status, 'OK');
                console.error(error.error + ' ' + error.status);
              }
              break;
            case 401:
              this.snackBar.open((error.statusText === 'OK' ? 'Unauthorised' : error.statusText) + ' '  + error.status, 'OK');
              console.error((error.statusText === 'OK' ? 'Unauthorised' : error.statusText) + ' '  + error.status);
              break;
            case 404:
              this.snackBar.open('Not Found', 'OK');
              console.info('Not Found');
              break;
            case 500:
              this.snackBar.open(error.error, 'OK');
              console.error(error.error);
              break;
            default:
              this.snackBar.open(error, 'OK');
              console.error(error);
              break;
          }
        }

        return throwError(error);
      })
    )
  }
}
