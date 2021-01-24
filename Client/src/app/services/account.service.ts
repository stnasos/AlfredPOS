import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, ReplaySubject, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  tokenSubscription = new Subscription();

  constructor(private http: HttpClient, private router: Router) { }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
        }
      })
    )
  }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
        }
      })
    )
  }

  logout() {
    this.tokenSubscription.unsubscribe();
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
    this.router.navigateByUrl('login');
  }

  setCurrentUser(user: User) {
    this.tokenSubscription.unsubscribe();

    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    this.currentUserSource.next(user);

    const timout = this.tokenTimeout(user.token);
    this.tokenSubscription = of(null).pipe(delay(timout)).subscribe(() => {
      this.logout();
    });
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  tokenTimeout(token: string): number {
    const exp = this.getDecodedToken(token).exp;
    return exp * 1000 - new Date().valueOf();
  }
}