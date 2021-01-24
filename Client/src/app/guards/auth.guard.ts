import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> {

    return this.accountService.currentUser$.pipe(
      map((user: User) => {
        if (user) return true;
        this.snackBar.open('Unauthorized', 'OK', {
          duration: 2000,
          panelClass: 'error',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        return this.router.parseUrl('login');
      })
    );
  }
}