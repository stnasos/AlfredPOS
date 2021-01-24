import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @ViewChild('drawer') drawer: any;
  isDark = true;
  title = 'Alfred POS';
  routeTitle = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private overlayContainer: OverlayContainer,
    public accountService: AccountService,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.overlayContainer.getContainerElement().classList.add('dark-theme');
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const childRoute = this.getChild(this.activatedRoute);
      childRoute.data.subscribe(data => {
        this.routeTitle = data.title;
        this.titleService.setTitle(this.title + ' - ' + data.title);
      });
    });
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    }
  }

  logout() {
    this.accountService.logout();
  }

  private getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
