import { Injectable } from '@angular/core';
import { Condition} from '../../models/genetic-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { GeneticMock } from './genetic.mock';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { TranslateService } from '@ngx-translate/core';
import { Index } from '../../models/authentication-model';
import { Bank } from '../../models/administrative-model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConditionService {

  index: Index;
  indexSubscription: Subscription;

  ruleSubject: BehaviorSubject<Bank>;
  rule: Observable<Bank>;

  ruleListSubject: BehaviorSubject<Array<Bank>>;
  ruleList: Observable<Array<Bank>>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              private geneticMock: GeneticMock,
              private administrativeMock: AdministrativeMock,
              private translateService: TranslateService) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      console.log('Creating CONDITION SERVICE WITH LANGUAGE: ' + translateService.currentLang);
      this.index = indexData as Index;

      if (translateService.currentLang === undefined || translateService.currentLang === null) {
        translateService.currentLang = 'ES';
      }

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept-Language': translateService.currentLang
        })
      };
    });
  }

  createCondition(condition: Condition): Observable<Condition> {
    if (environment.backendConnection) {
      return this.http.post<Condition>(this.index.conditionUrl + '/group_condition', condition, this.httpOptions).pipe(
        map(data => data as Condition)
      );
    } else {
      return of(this.geneticMock.generateCondition());
    }
  }

}
