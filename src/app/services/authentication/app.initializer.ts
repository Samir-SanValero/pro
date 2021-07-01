import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

export function appInitializer(authenticationService: AuthenticationService): any {
  console.log('Initializing PRECON');

  return () => {
    authenticationService.initializeAuthentication().subscribe(({}) => {});
    localStorage.removeItem(environment.storageToken);
    localStorage.setItem(environment.storageLanguageKey, environment.langES);
    return true;
  };

}
