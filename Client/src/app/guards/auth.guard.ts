import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  canActivate(): Observable<boolean> | boolean | UrlTree {
    let res!: boolean;
    
    this.accountService.currentUser$.pipe(map(user => {
      if (user) return true;
      return false;
    })).subscribe(auth => {
      res = auth;
    }).unsubscribe();

    if (res) {
      return true;
    } else {
      this.snackBar.open('Unauthorized', '', {
        duration: 2000,
        panelClass: 'error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return this.router.parseUrl('/login');
    }
  }
}