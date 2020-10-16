import { AdminService } from './services/admin.service';
import { CommentsComponent } from './comments/comments.component';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '' , redirectTo: '/home',pathMatch :'full'},
  {path :"home",component: HomeComponent},
  {path:"comments",component:CommentsComponent,canActivate : [AdminService]},
  {path:"posts",component:PostsComponent,canActivate : [AdminService]},
  {path :"login",component:LoginComponent},
  {path :"register",component:RegisterComponent},
  {path : "**", redirectTo:"/home",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
