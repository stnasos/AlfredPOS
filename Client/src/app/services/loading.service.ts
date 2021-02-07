import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSource = new ReplaySubject<boolean>(1);
  isLoading$ = this.loadingSource.asObservable();
  busyRequestCount = 0;

  constructor() {
    this.loadingSource.next(false);
  }

  busy() {
    this.busyRequestCount++;
    this.loadingSource.next(true);
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.loadingSource.next(false);
    }
  }
}
