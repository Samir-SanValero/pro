import { Injectable } from '@angular/core';
import { Ethnicity } from '../../models/administrative-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { AdministrativeMock } from './administrative.mock';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Index } from '../../models/authentication-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class EthnicityService {

  index: Index;
  indexSubscription: Subscription;

  ethnicity: Observable<Ethnicity>;

  ethnicityListSubject: BehaviorSubject<Array<Ethnicity>>;
  ethnicityList: Observable<Array<Ethnicity>>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/hal+json'
    })
  };

  constructor(private http: HttpClient,
              public authenticationService: AuthenticationService,
              public administrativeMock: AdministrativeMock) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      console.log('Group service - recovering index from service');
      this.index = indexData as Index;
    });
  }

  listEthnicities(): Observable<Array<Ethnicity>> {
    if (environment.backendConnection) {
      this.ethnicityList = this.http.get<Array<Ethnicity>>(this.index.ethnicityUrl + '?size=500', this.httpOptions).pipe(
          map(data => data[environment.embedded][environment.linksEthnicities] as Array<Ethnicity>)
      );
      console.log('Ethnicity service - recovered ethnicities');
      return this.ethnicityList;
    } else {
      const ethnicities = this.administrativeMock.generateEthnicityList();
      return of(ethnicities);
    }
  }

  listEthnicitiesByRequest(requestEthnicityUrl: string): Observable<Array<Ethnicity>> {
    if (environment.backendConnection) {
      this.ethnicityList = this.http.get<Array<Ethnicity>>(requestEthnicityUrl, this.httpOptions).pipe(
          map(data => data[environment.embedded][environment.linksEthnicities] as Array<Ethnicity>)
      );
      console.log('Ethnicity service - recovered ethnicities');
      return this.ethnicityList;
    } else {
      const ethnicities = this.administrativeMock.generateEthnicityList();
      return of(ethnicities);
    }
  }

  getEthnicityOfRequest(requestEthnicityUrl: string): Observable<Ethnicity> {
    if (environment.backendConnection) {
      this.ethnicity = this.http.get<Ethnicity>(requestEthnicityUrl, this.httpOptions).pipe(
          map(data => data as Ethnicity)
      );
      console.log('Ethnicity service - recovered ethnicity of request');
      return this.ethnicity;
    } else {
      const ethnicity = this.administrativeMock.generateEthnicity('1');
      return of(ethnicity);
    }
  }

}
