import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {tap, map} from "rxjs/operators"
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private url = "http://localhost:5000/api/account";

  constructor(private http: HttpClient) { }
  

  private userName = new BehaviorSubject<string>(localStorage.getItem("userName"));
  private userRole = new BehaviorSubject<string>(localStorage.getItem("userRole"));
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());


  checkLoginStatus(){
    var expireIn = localStorage.getItem('expireIn');
    if(new Date().getDate() > new Date(expireIn).getDate())
      return false;
    else
      return true;
  }

  register(userName : string ,email : string,password :string,confirmPassword){
    return this.http
      .post<any>(`${this.url}/register`,{userName,email,password,confirmPassword});
  }
  
  login(userName:string,password:string){
    return this.http
      .post<any>(`${this.url}/Login`,{userName,password})
      .pipe(map(res=>{
        if(res && res.jwtToken){
          localStorage.clear();

          localStorage.setItem("jwtToken",res.jwtToken);
          localStorage.setItem("userName",res.userName);
          localStorage.setItem("expireIn",res.expireIn);
          localStorage.setItem("userRole",res.roles[0]);
          localStorage.setItem("loginStatus","1");
            
          this.userName.next(res.userName);
          this.userRole.next(res.roles[0]);
          this.loginStatus.next(true);
        }
        return res;
      }));
  }
  logout(){
    localStorage.clear();
      
    this.userName.next('');
    this.userRole.next('');
    this.loginStatus.next(false);
  }

  get isLoggedIn():Observable<boolean>{
    return this.loginStatus.asObservable();
  }
  get currentUser():Observable<string>{
    return this.userName.asObservable();
  }
  get currentRole() :Observable<string>{
    return this.userRole.asObservable()
  }
}
