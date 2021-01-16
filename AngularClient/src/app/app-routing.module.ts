import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UserListComponent, data: { title: 'Users' } },
      { path: 'tables', component: TableListComponent, data: { title: 'Deck' } },
      { path: 'products', component: ProductListComponent, data: { title: 'Products' } },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } }
    ]
  },
  { path: 'login', component: LoginComponent, data: { title: 'Log In' } },
  { path: '**', component: NotFoundComponent, pathMatch: 'full', data: {title: 'Not Found'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
