import { Injectable } from '@angular/core';
import { Country } from '../../models/administrative-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { AdministrativeMock } from './administrative.mock';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Index } from '../../models/authentication-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class CountryService {

  index: Index;
  indexSubscription: Subscription;

  countrySubject: BehaviorSubject<Country>;
  country: Observable<Country>;

  countryListSubject: BehaviorSubject<Array<Country>>;
  countryList: Observable<Array<Country>>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/hal+json'
    })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              public administrativeMock: AdministrativeMock) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      console.log('Group service - recovering index from service');
      this.index = indexData as Index;
    });
  }

//   let params = new HttpParams();
//   if (pagination.currentPag !== undefined) {
//   params = params.append(environment.setPageNumber, pagination.currentPag.toString());
// }
//
// if (pagination.currentPagSize !== undefined) {
//   params = params.append(environment.setPageSize, pagination.currentPagSize.toString());
// }
//
// if (pagination.sortField !== undefined && pagination.sortOrder !== undefined) {
//   params = params.append(environment.setSortOrder, pagination.sortField + ',' + pagination.sortOrder);
// }
//
// this.requestHalObject = this.http.get<HalObject>(this.index.requestsUrl, { params }).pipe(
//   map(data => data as HalObject)
// );

  listCountries(): Observable<Array<Country>> {
    if (environment.backendConnection) {
      this.countryList = this.http.get<Array<Country>>(this.index.countriesUrl + '?size=500', this.httpOptions).pipe(
          map(data => data[environment.embedded][environment.linksCountries] as Array<Country>)
      );
      console.log('Country service - recovered countries');
      return this.countryList;
    } else {
      const countries = this.administrativeMock.generateCountryList();
      return of(countries);
    }
  }

  listCountriesByRequest(countryRequestUrl: string): Observable<Array<Country>> {
    if (environment.backendConnection) {
      this.countryList = this.http.get<Array<Country>>(countryRequestUrl, this.httpOptions).pipe(
          map(data => data[environment.embedded][environment.linksCountries] as Array<Country>)
      );
      console.log('Country service - recovered countries');
      return this.countryList;
    } else {
      const countries = this.administrativeMock.generateCountryList();
      return of(countries);
    }
  }

  getCountryOfRequest(countryRequestUrl: string): Observable<Country> {
    if (environment.backendConnection) {
      this.country = this.http.get<Country>(countryRequestUrl, this.httpOptions).pipe(
          map(data => data as Country)
      );
      console.log('Country service - recovered country of request');
      return this.country;
    } else {
      const country = this.administrativeMock.generateCountry('1');
      return of(country);
    }
  }

  listAllCountriesByRequest(countryRequestUrl: string): Observable<Array<Country>> {
     if (environment.backendConnection) {
       // let countriesObservable = this.http.get<HalObject>(countryRequestUrl, this.httpOptions).pipe(
       //     map(data => data as HalObject)
       // );
      this.countryList = this.http.get<Array<Country>>(countryRequestUrl, this.httpOptions).pipe(
        map(data => data[environment.embedded][environment.linksCountries] as Array<Country>)
      );
      console.log('Country service - recovered countries');
      return this.countryList;
    } else {
      const countries = this.administrativeMock.generateCountryList();
      return of(countries);
    }
  }

}
