import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuardGuard implements CanActivate {


  constructor(private authService:AuthService, private router:Router, private cookies:CookieService){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.cookies.get('role')!=''){
        return true;
      }
      else{
        this.router.navigate(['/home'])
        return false
      }

  }
  
  
}
