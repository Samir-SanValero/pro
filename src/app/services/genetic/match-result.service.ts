import { Injectable, OnDestroy } from '@angular/core';
import { MatchResult } from '../../models/genetic-model';
import { environment } from '../../../environments/environment';
import { Index } from '../../models/authentication-model';
import {BehaviorSubject, forkJoin, Observable, of, Subscription} from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MatchResultService {

  index: Index;
  indexSubscription: Subscription;

  // Http Headers
  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/hal+json'
   })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
        console.log('Mutation service - recovering index from service');
        this.index = indexData as Index;
        console.log('Mutation service - recovered index: ' + this.index.groupsUrl);
    });
  }

  getMatchResult(matchResultId: number): Observable<MatchResult> {
    if (environment.backendConnection) {
        return this.http.get<MatchResult>(this.index.matchResultUrl + '/' + matchResultId, this.httpOptions);
    } else {
        return of(new MatchResult());
    }
  }

  listMatchResult(): Array<MatchResult> {
    return new Array<MatchResult>();
  }

  updateMatchResult(matchResult: MatchResult): void {

  }

}
