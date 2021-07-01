import { Injectable } from '@angular/core';
import { DonorRequest, MatchRequest, Request } from '../../models/administrative-model';
import { Index } from '../../models/authentication-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AdministrativeMock } from './administrative.mock';
import {HalObject} from '../../models/common-model';

@Injectable({ providedIn: 'root' })
export class MatchRequestService {

  index: Index;
  indexSubscription: Subscription;

  matchRequestSubject: BehaviorSubject<MatchRequest>;
  matchRequest: Observable<MatchRequest>;

  matchRequestListSubject: BehaviorSubject<Array<MatchRequest>>;
  matchRequestList: Observable<Array<MatchRequest>>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              private administrativeMock: AdministrativeMock) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      this.index = indexData as Index;
    });
  }

  // listMatchRequestPagination(pagination: Pagination): Observable<HalObject> {
  //   console.log('Match request service - listing match request');
  //   if (environment.backendConnection) {
  //     let params = new HttpParams();
  //     if (pagination.currentPag !== undefined) {
  //       params = params.append(environment.setPageNumber, pagination.currentPag.toString());
  //     }
  //
  //     if (pagination.currentPagSize !== undefined) {
  //       params = params.append(environment.setPageSize, pagination.currentPagSize.toString());
  //     }
  //
  //     if (pagination.sortField !== undefined && pagination.sortOrder !== undefined) {
  //       params = params.append(environment.setSortOrder, pagination.sortField + ',' + pagination.sortOrder);
  //     }
  //
  //     const halObject = this.http.get<HalObject>(this.index.matchRequestUrl, { params }).pipe(
  //       map(data => data as HalObject)
  //     );
  //     console.log('Match request service - recovered hal object match requests');
  //     return halObject;
  //   } else {
  //     const halObject = this.administrativeMock.generateHalObject(environment., this.administrativeMock.generateBankList());
  //     return of(halObject);
  //   }
  // }

  createMatchRequest(requestId: string, matchRequest: MatchRequest): Observable<MatchRequest> {
    matchRequest.state = 'CREATED';
    if (environment.backendConnection) {
      return this.http.post<MatchRequest>(this.index.matchRequestUrl + '/request/' + requestId + '/match_requests',
          JSON.stringify(matchRequest), this.httpOptions);
    } else {
      return of(this.administrativeMock.generateMatchRequest('1'));
    }
  }

  addTargetRequestsToMatchRequest(matchRequest: MatchRequest, targets: Array<Request>): void {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'text/uri-list'
      })
    };

    if (environment.backendConnection) {
      for (const target of targets) {
        console.log('Adding target of match: ' + target._links.self.href);

        this.http.post<DonorRequest>(matchRequest._links.self.href + '/target_requests/',
            target._links.self.href, options);
      }
    }
  }

  addTargetRequestToMatchRequest(requestId: number, matchRequest: MatchRequest): void {
    if (environment.backendConnection) {
      // this.http.put<DonorRequest>(this.index.matchRequestUrl + '/request/' + requestId,
      //     JSON.stringify(matchRequest), this.httpOptions).pipe(retry(1));
    } else {

    }
  }

  replaceTargetRequestOfMatchRequest(requestId: number, matchRequest: MatchRequest): void {
    if (environment.backendConnection) {
      // this.http.put<DonorRequest>(this.index.matchRequestUrl + '/request/' + requestId,
      //     JSON.stringify(matchRequest), this.httpOptions).pipe(retry(1));
    } else {

    }
  }

  updateMatchRequest(requestId: number, matchRequest: MatchRequest): void {
    if (environment.backendConnection) {
      this.http.put<DonorRequest>(this.index.matchRequestUrl + '/request/' + requestId,
        JSON.stringify(matchRequest), this.httpOptions).pipe(retry(1));
    } else {

    }
  }

  // getMatchResults(match: MatchRequest): Observable<HalObject> {
  //   if (environment.backendConnection) {
  //     // return this.http.post<MatchRequest>(this.index.matchRequestUrl + '/request/' + requestId + '/match_requests',
  //     //   JSON.stringify(matchRequest), this.httpOptions);
  //   } else {
  //     // return of(this.administrativeMock.generateMatchResultList());
  //   }
  // }



}
