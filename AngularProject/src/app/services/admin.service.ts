import { AccountService } from './account.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements CanActivate {
    
    constructor(
        private accountService: AccountService) {
        
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : boolean {
        if(this.accountService.isLoggedIn){
            let role = localStorage.getItem('userRole');
            if(role && (role.toLowerCase() === 'admin' || role.toLowerCase() === 'moderator'))
                return true;
            else
                return false;
        }
        return false;
    }
    
}