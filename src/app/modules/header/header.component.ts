import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/authentication-model';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public user: User;
  public userSubscription: Subscription;
  public selectedLanguage;

  constructor(public authenticationService: AuthenticationService,
              public translateService: TranslateService) {
  }

  ngOnInit(): void {
    console.log('Storage language - ' + localStorage.getItem(environment.storageLanguageKey));
    if (localStorage.getItem(environment.storageLanguageKey) === undefined ||
        localStorage.getItem(environment.storageLanguageKey) === null) {
      this.selectedLanguage = this.translateService.getBrowserLang();
      this.translateService.use(this.selectedLanguage);
    } else {
      this.selectedLanguage = localStorage.getItem(environment.storageLanguageKey);
      this.translateService.use(this.selectedLanguage);
    }

    this.user = new User();

    this.userSubscription = this.authenticationService.getUserObservable().subscribe((userData) => {
      this.user = userData as User;
      console.log('Header component - recovered user');
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription !== undefined) {
      this.userSubscription.unsubscribe();
    }
  }

  changeLanguage(event: any): void {
    console.log('Header component - changed language: ' + event.value);
    this.translateService.setDefaultLang(event.value);
    this.translateService.use(event.value);
    localStorage.setItem(environment.storageLanguageKey, event.value);
  }

}
