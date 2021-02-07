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
      catchError(errorResponse => {
        if(errorResponse) {
          switch (errorResponse.status) {
            case 0:
              this.snackBar.open(errorResponse.statusText, 'OK');
              break;
            case 400:
              if(errorResponse.error.errors) {
                const modalStateErrors = [];
                for (const key in errorResponse.error.errors) {
                  if (errorResponse.error.errors[key]) {
                    modalStateErrors.push(errorResponse.error.errors[key]);
                  }
                }
                // TODO: create a better template for snackBar messages
                this.snackBar.open(modalStateErrors.join('\n'), 'OK');
                //throw modalStateErrors.flat();
              } else {
                this.snackBar.open(errorResponse.error + ' ' + errorResponse.status, 'OK');
              }
              break;
            case 401:
              this.snackBar.open(errorResponse.status + ' ' + errorResponse.error, 'OK');
              break;
            case 403:
              this.snackBar.open(errorResponse.status + ' ' + errorResponse.error, 'OK');
              break;
            case 404:
              this.snackBar.open('Not Found', 'OK');
              break;
            case 500:
              this.snackBar.open(errorResponse.error, 'OK');
              break;
            default:
              this.snackBar.open(errorResponse, 'OK');
              break;
          }
        }

        return throwError(errorResponse);
      })
    )
  }
}
