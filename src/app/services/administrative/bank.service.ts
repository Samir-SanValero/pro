import { Injectable, OnDestroy } from '@angular/core';
import { Bank, Request } from '../../models/administrative-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Index } from '../../models/authentication-model';
import { map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AdministrativeMock } from './administrative.mock';
import { HalObject, Pagination } from '../../models/common-model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class BankService implements OnDestroy {
  index: Index;
  indexSubscription: Subscription;

  bankSubject: BehaviorSubject<Bank>;
  bank: Observable<Bank>;

  bankListSubject: BehaviorSubject<Array<Bank>>;
  bankList: Observable<Array<Bank>>;

  bankRequestsSubject: BehaviorSubject<Array<Request>>;
  bankRequests: Observable<Array<Request>>;

  bankHalObject: Observable<HalObject>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              private administrativeMock: AdministrativeMock,
              private translateService: TranslateService) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      console.log('Creating BANK SERVICE WITH LANGUAGE: ' + translateService.currentLang);
      this.index = indexData as Index;

      if (translateService.currentLang === undefined || translateService.currentLang === null) {
        translateService.currentLang = 'ES';
        console.log('LANGUAGE is null, using ES language');
      }

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept-Language': translateService.currentLang
        })
      };
    });
  }

  ngOnDestroy(): void {
    if (this.indexSubscription !== undefined) {
      this.indexSubscription.unsubscribe();
    }
  }

  createBank(bank: Bank): Observable<Bank> {
    console.log('Bank service - creating bank');
    if (environment.backendConnection) {
      return this.http.post<Bank>(this.index.banksUrl, bank, this.httpOptions).pipe(
          map(data => data as Bank)
      );
    } else {
      return of(bank);
    }
  }

  updateBank(bank: Bank): Observable<Bank>  {
    console.log('Bank service - updating bank');
    console.log('Bank service - Bank name: ' + bank.name);
    console.log('Bank service - Bank code: ' + bank.code);
    console.log('Bank service - Bank active: ' + bank.active);
    console.log('Bank service - Bank description: ' + bank.description);
    console.log('Bank service - Bank groupCode: ' + bank.groupCode);
    console.log('Bank service - Bank self: ' + bank._links.self.href);
    if (environment.backendConnection) {
      // return of(bank);
      return this.http.put<Bank>(bank._links.self.href, bank, this.httpOptions).pipe(
          map(data => data as Bank)
      );
    } else {
      return of(bank);
    }
  }

  deleteBank(bank: Bank): Observable<any> {
    console.log('Bank service - deleting bank');

    if (environment.backendConnection) {
      return this.http.delete<any>(bank._links.self.href, this.httpOptions).pipe(
          map(data => data as Bank)
      );
    } else {
      return of('');
    }
  }

  getBank(bankId: number): Observable<Bank> {
    if (environment.backendConnection) {
      // this.bank = this.http.get<Bank>(this.index.banksUrl + '/' + bankId, this.httpOptions).pipe(retry(1));
      // return bank;
    } else {
      // TEST
      const bank = this.administrativeMock.generateBank('1');
      return of(bank);
    }
  }

  getBankByParameter(pagination: Pagination, parameter: string): Observable<HalObject> {
    if (environment.backendConnection) {
      let params = new HttpParams();
      params = params.append(parameter, pagination.textFilter);
      if (pagination.currentPag !== undefined) {
        params = params.append(environment.setPageNumber, pagination.currentPag.toString());
      }

      if (pagination.currentPagSize !== undefined) {
        params = params.append(environment.setPageSize, pagination.currentPagSize.toString());
      }

      if (pagination.sortField !== undefined && pagination.sortOrder !== undefined &&
        pagination.sortField !== null && pagination.sortOrder !== null &&
        pagination.sortField !== '' && pagination.sortOrder !== '') {
        params = params.append(environment.setSortOrder, pagination.sortField + ',' + pagination.sortOrder);
      }

      let url = this.index.banksSearchUrl;

      if (parameter === 'name') {
        url = url + 'findByName';
      } else  if (parameter === 'code') {
        url = url + 'findByCode';
      } else  if (parameter === 'groupName') {
        url = url + 'findByGroupName';
      }

      console.log('url: ' + url);
      console.log('textFilter:' + pagination.textFilter);
      console.log('textField:' + pagination.textField);
      console.log('sortOrder:' + pagination.sortOrder);
      console.log('sortField:' + pagination.sortField);

      return this.http.get<HalObject>(url, { params });
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksBanks, this.administrativeMock.generateBankList());
      return of(halObject);
    }
  }

  listBanks(): Observable<Array<Bank>> {
    if (environment.backendConnection) {
      this.bankList = this.http.get<Array<Bank>>(this.index.banksUrl, this.httpOptions).pipe(
          map(data => data[environment.embedded][environment.linksBanks] as Array<Bank>)
      );
      console.log('Bank service - recovered banks');
      return this.bankList;
    } else {
      const banks = this.administrativeMock.generateBankList();
      return of(banks);
    }
  }

  listBanksPagination(pagination: Pagination): Observable<HalObject> {
    console.log('Bank service - listing banks');
    if (environment.backendConnection) {
      let params = new HttpParams();
      if (pagination.currentPag !== undefined) {
        params = params.append(environment.setPageNumber, pagination.currentPag.toString());
      }

      if (pagination.currentPagSize !== undefined) {
        params = params.append(environment.setPageSize, pagination.currentPagSize.toString());
      }

      if (pagination.sortField !== undefined && pagination.sortOrder !== undefined) {
        params = params.append(environment.setSortOrder, pagination.sortField + ',' + pagination.sortOrder);
      }

      this.bankHalObject = this.http.get<HalObject>(this.index.banksUrl, { params }).pipe(
          map(data => data as HalObject)
      );
      console.log('Bank service - recovered hal object banks');
      return this.bankHalObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksBanks, this.administrativeMock.generateBankList());
      return of(halObject);
    }
  }

  getBankRequests(bankId: number): Observable<Array<Request>> {
    if (environment.backendConnection) {
      // this.bankRequests = this.http.get<Array<Request>>(this.index.banksUrl + '/' +
      // bankId + '/requests', this.httpOptions).pipe(retry(1));
      // return this.bankRequests;
    } else {
      const requests = this.administrativeMock.generateRequestList();
      return of(requests);
    }
  }

  addRequestsToBank(bank: Bank, request: Request): void {
    const httpAddRequestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/uri-list'
      })
    };

    if (environment.backendConnection) {
      this.http.post<string>(bank._links.self.href + '/requests', request._links.self.href, httpAddRequestOptions).pipe(retry(1));
    }
  }

  removeRequestFromBank(bank: Bank, request: Request): Observable<any> {
    const httpRemoveRequestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/uri-list'
      })
    };

    if (environment.backendConnection) {
      // this.http.delete<string>(bank._links.self.href + '/requests', request._links.self.href, httpRemoveRequestOptions).pipe(retry(1));
      return of('');
    } else {
      return of('');
    }
  }

  modifyRequestInBank(bankId: number, listRequest: Array<Request>): void {
    if (environment.backendConnection) {

    } else {
      let requestsString = '';

      for (const request of listRequest) {
        requestsString = requestsString;
      }

      this.http.put<Request>(this.index.banksUrl + '/' + bankId + '/requests', requestsString, this.httpOptions).pipe(retry(1));
    }
  }

  findMatchableRequestFromRequest(bank: Bank, request: Request): Observable<Array<Request>> {
    const encodedRequestUri = encodeURI(request._links.self.href);

    if (environment.backendConnection) {
      this.bankRequests = this.http.get<Array<Request>>(bank._links.self.href +
      '/matchable_requests?request=' + encodedRequestUri, this.httpOptions).pipe(retry(1));
      return this.bankRequests;
    } else {
      const requests = this.administrativeMock.generateRequestList();
      return of(requests);
    }
  }

}
