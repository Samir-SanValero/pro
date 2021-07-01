import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('JwtInterceptor - Intercepted backend connection');
    // add auth header with jwt if user is logged in and request is to the api url

    const user = this.authenticationService.getCurrentUser();

    const isLoggedIn = user && user.authToken;

    if (isLoggedIn) {
      request = request.clone({
        setHeaders: { Authorization: 'Bearer ' + user.authToken }
      });
    }
    return next.handle(request);
  }

}
