import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private router: Router, private cookies: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const token: string|null = this.cookies.get('token');

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${ token }`
        }       
      });
      console.log(`Bearer ${ token }`);
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        // if (err.status === 401) {
        //   this.router.navigateByUrl('/');
        // }

        return throwError( err );

      })
    );
  }

}
