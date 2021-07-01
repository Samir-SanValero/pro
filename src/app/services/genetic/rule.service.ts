import { Injectable } from '@angular/core';
import {Action, Condition, Gene, Rule, RuleConditionGroup} from '../../models/genetic-model';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { GeneticMock } from './genetic.mock';
import { HalObject, Pagination } from '../../models/common-model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { TranslateService } from '@ngx-translate/core';
import { Index } from '../../models/authentication-model';
import { Bank } from '../../models/administrative-model';

@Injectable({ providedIn: 'root' })
export class RuleService {
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
      console.log('Creating BANK SERVICE WITH LANGUAGE: ' + translateService.currentLang);
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

  listRulesPagination(pagination: Pagination): Observable<HalObject> {
    console.log('Rule service - listing rules');
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

      const halObject = this.http.get<HalObject>(this.index.rulesUrl, { params }).pipe(
        map(data => data as HalObject)
      );
      console.log('Rule service - recovered hal object rules');
      return halObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksRules, this.geneticMock.generateRuleList());
      return of(halObject);
    }
  }

  getRuleByParameter(pagination: Pagination, parameter: string): Observable<HalObject> {
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

      let url = this.index.rulesSearchUrl;

      if (parameter === 'name') {
        url = url + 'searchByName';
      }

      console.log('url: ' + url);
      console.log('textFilter:' + pagination.textFilter);
      console.log('textField:' + pagination.textField);
      console.log('sortOrder:' + pagination.sortOrder);
      console.log('sortField:' + pagination.sortField);

      return this.http.get<HalObject>(url, { params });
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksRules, this.geneticMock.generateRuleList());
      return of(halObject);
    }
  }

  getRule(id: string): Observable<Rule> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateRule('1'));
    }
  }

  createRule(rule: Rule): Observable<Rule> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateRule('1'));
    }
  }

  updateRule(rule: Rule): Observable<Rule> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateRule('1'));
    }
  }

  deleteRule(rule: Rule): Observable<Rule> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateRule('1'));
    }
  }

  createConditionGroupA(rule: Rule, ruleConditionGroup: RuleConditionGroup): Observable<RuleConditionGroup> {
    if (environment.backendConnection) {
      return this.http.post<RuleConditionGroup>(rule._links.self.href, ruleConditionGroup, this.httpOptions).pipe(
        map(data => data as RuleConditionGroup)
      );
    } else {
      return of(this.geneticMock.generateRuleConditionGroup());
    }
  }

  createConditionGroupB(rule: Rule, ruleConditionGroup: RuleConditionGroup): Observable<RuleConditionGroup> {
    if (environment.backendConnection) {
      return this.http.post<RuleConditionGroup>(rule._links.self.href, ruleConditionGroup, this.httpOptions).pipe(
        map(data => data as RuleConditionGroup)
      );
    } else {
      return of(this.geneticMock.generateRuleConditionGroup());
    }
  }

  deleteCondition(condition: Condition): Observable<any> {
    console.log('Rule service - deleting condition');
    if (environment.backendConnection) {
      return this.http.delete<any>(condition._links.self.href, this.httpOptions).pipe(
        map(data => data as Condition)
      );
    } else {
      return of('');
    }
  }

  deleteAction(action: Action): Observable<any> {
    console.log('Rule service - deleting action');
    if (environment.backendConnection) {
      return this.http.delete<any>(action._links.self.href, this.httpOptions).pipe(
        map(data => data as Action)
      );
    } else {
      return of('');
    }
  }

  getConditionsFromGroup(ruleConditionGroup: RuleConditionGroup): Observable<HalObject> {
    if (environment.backendConnection) {
      return this.http.get<HalObject>(ruleConditionGroup._links['precon:conditions'].href, this.httpOptions).pipe(
        map(data => data as HalObject)
      );
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksConditionCnv, this.geneticMock.generateRuleList());
      return of(halObject);
    }
  }

  getActionsFromRule(rule: Rule): Observable<HalObject> {
    if (environment.backendConnection) {
      return this.http.get<HalObject>(rule._links['precon:actions'].href, this.httpOptions).pipe(
        map(data => data as HalObject)
      );
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksActionWarning, this.geneticMock.generateActionList());
      return of(halObject);
    }
  }

  getConditionGroupAFromRule(rule: Rule): Observable<RuleConditionGroup> {
    console.log('RULE CONDITION A: ' + rule._links['precon:ruleConditionGroupA'].href);
    if (environment.backendConnection) {
      return this.http.get<RuleConditionGroup>(rule._links['precon:ruleConditionGroupA'].href, this.httpOptions).pipe(
        map(data => data as RuleConditionGroup)
      );
    } else {
      return of(this.geneticMock.generateRuleConditionGroup());
    }
  }

  getConditionGroupBFromRule(rule: Rule): Observable<RuleConditionGroup> {
    console.log('RULE CONDITION B: ' + rule._links['precon:ruleConditionGroupB'].href);
    if (environment.backendConnection) {
      return this.http.get<RuleConditionGroup>(rule._links['precon:ruleConditionGroupB'].href, this.httpOptions).pipe(
        map(data => data as RuleConditionGroup)
      );
    } else {
      return of(this.geneticMock.generateRuleConditionGroup());
    }
  }

  getGeneFromCondition(condition: Condition): Observable<Gene> {
    if (environment.backendConnection) {
        return this.http.get<Gene>(condition._links['precon:gene'].href, this.httpOptions).pipe(
          map(data => data as Gene)
        );
    } else {
      return of(this.geneticMock.generateGene('1'));
    }
  }

  getGenesFromCondition(condition: Condition): Observable<HalObject> {
    if (environment.backendConnection) {
      return this.http.get<HalObject>(condition._links['precon:genes'].href, this.httpOptions).pipe(
        map(data => data as HalObject)
      );
    } else {
      return of(this.administrativeMock.generateHalObject(environment.linksGenes, this.geneticMock.generateGeneList()));
    }
  }

}
