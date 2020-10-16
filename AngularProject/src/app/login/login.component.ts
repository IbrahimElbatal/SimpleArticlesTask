import { Router } from '@angular/router';
import { AccountService } from './../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(
    private fb:FormBuilder,
    private accountService:AccountService,
    private router : Router) { }

  loginForm: FormGroup;

  userName : FormControl;
  password :FormControl;

  ngOnInit(): void {
    this.userName = new FormControl('',[Validators.required]);
    this.password = new FormControl('',[Validators.required]);

    this.loginForm = this.fb.group({
        "userName" : this.userName,
        "password" :this.password
      });
  
  }
  onLogin(){
    this.accountService.login(this.userName.value,this.password.value)
      .subscribe(_=> this.router.navigateByUrl("/home"));
  }
}
