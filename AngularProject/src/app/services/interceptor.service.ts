import { AccountService } from './account.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    
    constructor(
        private accountService: AccountService) {
        
    }
    intercept(req:HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if(this.accountService.isLoggedIn){
            let jwtToken = localStorage.getItem('jwtToken');
            if(jwtToken && jwtToken != ''){
                let newReq = req.clone({headers : req.headers.set("Authorization","Bearer " +jwtToken)})
                return next.handle(newReq);
            }
        }
       return next.handle(req);
    }
}