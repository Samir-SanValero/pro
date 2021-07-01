import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { LoginEntity } from '../../models/authentication-model';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit, OnDestroy {
  loginEntity: LoginEntity;
  showLogin: boolean;
  loginSubscription: Subscription;

  constructor(public authenticationService: AuthenticationService,
              public notificationMessage: MatSnackBar,
              public router: Router) { }

  ngOnInit(): void {
    this.loginEntity = new LoginEntity();
    this.showLogin = environment.login;

    if (this.showLogin) {
      if (this.authenticationService.getCurrentUser().authToken === undefined) {
        this.showLogin = true;
      } else {
        console.log('Saving token in localStorage');
        localStorage.setItem(environment.storageToken, this.authenticationService.getCurrentUser().authToken);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.loginSubscription !== undefined) {
      this.loginSubscription.unsubscribe();
    }
  }

  /**
   * Only for test deployment purposes
   */
  login(): void {
    this.loginSubscription = this.authenticationService.login(this.loginEntity).subscribe(
        (loginEntityData) => {
          console.log('Asking SSO for auth token');
          const loginResult = loginEntityData as LoginEntity;

          if (loginResult !== undefined) {
            if (loginResult.token !== undefined) {
              // Decode and set current user
              console.log('Decoding token');
              const user = this.authenticationService.decodeUser(loginResult.token);
              this.authenticationService.setCurrentUser(user);

              // Set token on storage
              console.log('Saving token in localStorage');
              localStorage.setItem(environment.storageToken, loginResult.token);

              // Show main screen
              this.showLogin = false;
            }
          }
        },
        error => {
          console.log('Error caught: ' + error.toString());
        }
    );
  }
}
