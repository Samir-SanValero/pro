import { Injectable } from '@angular/core';
import { DonorRequest } from '../../models/administrative-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Index } from '../../models/authentication-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { retry } from 'rxjs/operators';
import { AdministrativeMock } from './administrative.mock';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DonorRequestService {

  index: Index;
  indexSubscription: Subscription;

  donorRequestSubject: BehaviorSubject<DonorRequest>;
  donorRequest: Observable<DonorRequest>;

  donorRequestListSubject: BehaviorSubject<Array<DonorRequest>>;
  donorRequestList: Observable<Array<DonorRequest>>;

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

  listDonorRequestByRequest(requestId: number): Observable<Array<DonorRequest>> {
    if (environment.backendConnection) {
      // this.donorRequestList = this.http.get<Array<DonorRequest>>(this.index.donorRequestUrl
      // + '/request/' + requestId, this.httpOptions).pipe(retry(1));
      // return this.donorRequestList;
    } else {
      const donorRequestList: Array<DonorRequest> = this.administrativeMock.generateDonorRequestList();
      return of(donorRequestList);
    }
  }

  listRequestedDonorRequest(): Observable<Array<DonorRequest>> {
    if (environment.backendConnection) {
      // this.donorRequestList = this.http.get<Array<DonorRequest>>(this.index.donorRequestUrl
      // + '/requested', this.httpOptions).pipe(retry(1));
      // return this.donorRequestList;
    } else {
      const donorRequestList: Array<DonorRequest> = this.administrativeMock.generateDonorRequestList();
      return of(donorRequestList);
    }
  }

  listReceivedDonorRequest(): Observable<Array<DonorRequest>> {
    if (environment.backendConnection) {
      // this.donorRequestList = this.http.get<Array<DonorRequest>>(this.index.donorRequestUrl
      // + '/received', this.httpOptions).pipe(retry(1));
      // return this.donorRequestList;
    } else {
      const donorRequestList: Array<DonorRequest> = this.administrativeMock.generateDonorRequestList();
      return of(donorRequestList);
    }
  }

  createDonorRequest(requestId: number, donorRequest: DonorRequest): void {
    if (environment.backendConnection) {

    } else {
      this.http.post<DonorRequest>(this.index.donorRequestUrl + '/request/' + requestId,
          JSON.stringify(donorRequest), this.httpOptions).pipe(retry(1));
    }
  }

  updateDonorRequest(requestId: number, donorRequest: DonorRequest): void {
    if (environment.backendConnection) {

    } else {
      this.http.put<DonorRequest>(this.index.donorRequestUrl + requestId,
          JSON.stringify(donorRequest), this.httpOptions).pipe(retry(1));
    }
  }
}
