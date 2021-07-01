import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

    const user = this.authenticationService.getCurrentUser();

    // console.log('Auth guard - user: ' + user.authToken);
    if (user !== undefined) {
      console.log('Auth Guard - Logged so return to normal screen');
      console.log(state.url);
      return true;
    } else {
      if (environment.login) {
        // not logged in so redirect to login page with the return url
        console.log('Auth Guard - Routing to internal login, not authenticated');
        // this.router.navigate(['login']);
        return false;
      } else {
        // not logged in so redirect to login page with the return url
        console.log('Auth Guard - Routing to external login, not authenticated');
        // this.router.navigate(['externalLogin']);
        return false;
      }
    }
  }
}
