import { Component, OnInit } from '@angular/core';
import { User } from './models/User';
import { AccountService } from './services/account.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Alfred POS+';

  constructor(private accountService: AccountService, public loadingService: LoadingService) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    if(user) {
      this.accountService.setCurrentUser(user);
    } else {
      this.accountService.logout();
    }
  }
}
