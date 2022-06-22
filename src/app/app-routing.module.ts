import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserListComponent } from './user-list/user-list.component';


const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'users', 
    pathMatch: 'full'
  },
  { path: 'users', component: UserListComponent },
  { path: 'users/create-user', component: CreateUserComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
