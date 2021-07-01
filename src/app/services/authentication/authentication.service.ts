import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Index, LoginEntity, User } from '../../models/authentication-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  public indexSubject: BehaviorSubject<Index>;
  public index: Observable<Index>;

  public loginEntity: Observable<LoginEntity>;
  public loginSubscription: Subscription;

  constructor(private http: HttpClient,
              private router: Router) {
    this.userSubject = new BehaviorSubject<User>(new User());
    this.user = this.userSubject.asObservable();

    this.indexSubject = new BehaviorSubject<Index>(new Index());
  }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/hal+json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  public getCurrentUser(): User {
    return this.userSubject.value;
  }

  public setCurrentUser(user: User): void {
    this.userSubject.next(user);
  }

  public login(loginEntity: LoginEntity): Observable<LoginEntity> {
    console.log('Auth service - doing login');
    return this.http.post<LoginEntity>(environment.authUrl, loginEntity, this.httpOptions).pipe();
  }

  /**
   * Searches for Single Sign On token
   * - If found, emits user value for other modules
   * - If not found, redirect to domain login
   * TESTING PURPOSES:
   * Loads login to get new JWT token to Single Sign On
   */
  public initializeAuthentication(): any {
    console.log('Authentication Service - initializeAuthentication');
    let token;

    token = localStorage.getItem(environment.storageToken);

    // For development only, temporal auth token
    if (!environment.login) {
      token = environment.testAuthToken;
    }

    // For development only, temporal auth token
    if (token === undefined || token === null) {
      console.log('Authentication Service - no token found, redirecting to SSO login');
      this.router.navigate(['']);
    } else {
      console.log('Authentication Service - token found');
      const user = this.decodeUser(token);
      user.authToken = token;
      console.log('Authentication Service - token found, setting user ' + user.firstName);
      this.userSubject.next(user);
    }

    this.loadIndex();

    return this.userSubject.asObservable();
  }

  /**
   * Decodes JWT token to form User object
   */
  public decodeUser(token: string): User {
    console.log('Authentication Service - Decoding JWT token: ' + token);
    const decodedToken = atob(token.split('.')[1]);

    // console.log('Decoded token: ' + decodedToken);
    const user: User = JSON.parse(decodedToken);
    user.authToken = token;

    console.log('Authentication Service - User ID: ' + user.id);
    console.log('Authentication Service - User groupId: ' + user.groupId);
    console.log('Authentication Service - User groupCode: ' + user.groupCode);
    console.log('Authentication Service - User email: ' + user.email);
    console.log('Authentication Service - User firstName: ' + user.firstName);
    console.log('Authentication Service - User lastName: ' + user.lastName);
    console.log('Authentication Service - User companyName: ' + user.companyName);
    console.log('Authentication Service - User roles: ' + user.roles);
    console.log('Authentication Service - User langKey: ' + user.langKey);
    console.log('Authentication Service - User activated: ' + user.activated);
    console.log('Authentication Service - User iss: ' + user.iss);
    console.log('Authentication Service - User iat: ' + user.iat);
    console.log('Authentication Service - User exp: ' + user.exp);

    return user;
  }

  /**
   *
   */
  // TODO get from backend
  public loadIndex(): void {
    const index = new Index();

    index.authUrl                 = environment.authUrl;

    index.groupsUrl               = environment.apiUrl + '/groups';
    index.groupsSearchUrl         = environment.apiUrl + '/groups/search/';

    index.banksUrl                = environment.apiUrl + '/banks';
    index.banksSearchUrl          = environment.apiUrl + '/banks/search/';

    index.requestsUrl             = environment.apiUrl + '/requests';
    index.requestsSearchUrl       = environment.apiUrl + '/requests/search/';

    index.diseasesUrl             = environment.apiUrl + '/diseases';
    index.diseasesSearchUrl       = environment.apiUrl + '/diseases/search/';

    index.genesUrl                = environment.apiUrl + '/genes';
    index.genesSearchUrl          = environment.apiUrl + '/genes/search/';

    index.cnvsUrl                 = environment.apiUrl + '/cnvs';
    index.cnvsSearchUrl           = environment.apiUrl + '/cnvs/search/';

    index.mutationsUrl            = environment.apiUrl + '/mutations';
    index.mutationsSearchUrl      = environment.apiUrl + '/mutations/search/find';

    index.templatesUrl            = environment.apiUrl + '/templates';
    index.templateFavouritesUrl   = environment.apiUrl + '/templateFavourites';
    index.templatesAcceptedUrl    = environment.apiUrl + '/individual_report_statuses/accepted_languages';
    index.templatesSampleTypesUrl = environment.apiUrl + '/individual_report_statuses/accepted_sample_types';

    index.genotypeUrl             = environment.apiUrl + '/genotypes';

    index.rulesUrl                = environment.apiUrl + '/rules';

    index.conditionUrl            = environment.apiUrl + '/conditions';

    index.actionUrl               = environment.apiUrl + '/actions';

    index.permissionUrl           = environment.apiUrl + '/permissions';
    index.countriesUrl            = environment.apiUrl + '/countries';
    index.ethnicityUrl            = environment.apiUrl + '/ethnicities';
    index.donorRequestUrl         = environment.apiUrl + '/donor_requests';
    index.matchRequestUrl         = environment.apiUrl + '/match_requests';
    index.matchResultUrl          = environment.apiUrl + '/match_result';
    index.genotypeUrl             = environment.apiUrl + '/genotypes';
    index.rulesUrl                = environment.apiUrl + '/rules';
    index.templatesUrl            = environment.apiUrl + '/templates';
    index.templateFavouritesUrl   = environment.apiUrl + '/templateFavourites';
    index.permissionUrl           = environment.apiUrl + '/permissions';
    index.countriesUrl            = environment.apiUrl + '/countries';
    index.ethnicityUrl            = environment.apiUrl + '/ethnicities';
    index.donorRequestUrl         = environment.apiUrl + '/donor_requests';

    index.foundMutationUrl        = environment.apiUrl + '/found_mutations';
    index.uncoveredMutationsUrl   = environment.apiUrl + '/uncovered_mutations';
    index.noNgsMutationsUrl       = environment.apiUrl + '/mutation_no_ngs';
    index.studiedMutationsUrl     = environment.apiUrl + '/studied_mutations/';
    index.uncoveredCnvsUrl        = environment.apiUrl + '/cnv_requests';

    this.indexSubject.next(index);
  }

  getIndexObservable(): Observable<Index> {
    return this.indexSubject.asObservable().pipe();
  }

  getUserObservable(): Observable<User> {
    return this.userSubject.asObservable().pipe();
  }
}


