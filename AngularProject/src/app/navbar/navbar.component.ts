import { Observable } from 'rxjs';
import { AccountService } from './../services/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public accountService:AccountService,
    private router: Router) { }

  userName$:Observable<string> ;
  userRole$ : Observable<string>;
  isLoggedIn$ :Observable<boolean>;
  ngOnInit(): void {
    this.userName$ = this.accountService.currentUser;
    this.userRole$ = this.accountService.currentUser;
    this.isLoggedIn$ = this.accountService.isLoggedIn;
  }

  onLogout(){
    this.accountService.logout();
    this.router.navigateByUrl('/login');
  }
}
