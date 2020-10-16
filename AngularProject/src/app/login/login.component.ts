import { Router } from '@angular/router';
import { AccountService } from './../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

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
   
    this.userName = new FormControl('',[Validators.required,Validators.minLength(3)]);
    this.password = new FormControl('',[Validators.required,Validators.minLength(6)]);
   
    this.loginForm = this.fb.group({
        "userName" : this.userName,
        "password" :this.password
      });
  
  }
  onLogin(){
    this.accountService.login(this.userName.value,this.password.value)
      .subscribe(_=> this.router.navigateByUrl("/home"),
      (error :HttpErrorResponse)=>{
        if(error.status == 404)
          alert(error.error);
        else
        alert('UnKnown Error Occur Check your Api Service.');
        
        console.log(error);
      });
  }
}
