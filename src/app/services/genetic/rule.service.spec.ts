import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RuleService } from './rule.service';
import { GeneticMock } from './genetic.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Pagination } from '../../models/common-model';
import {Rule, RuleConditionGroup} from '../../models/genetic-model';

describe('RuleServiceTest', () => {
  let service: RuleService;
  let mock: GeneticMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()],
      providers: [HttpClient]
    });
    service = TestBed.inject(RuleService);
    mock = TestBed.inject(GeneticMock);
  });

  it('RuleService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#listRulesPagination should return value', (done: DoneFn) => {
    service.listRulesPagination(new Pagination()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getConditionsFromGroup should return value', (done: DoneFn) => {
    service.getConditionsFromGroup(new RuleConditionGroup()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getActionsFromRule should return value', (done: DoneFn) => {
    service.getActionsFromRule(mock.generateRule('1')).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getConditionGroupAFromRule should return value', (done: DoneFn) => {
    service.getConditionGroupAFromRule(mock.generateRule('1')).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getConditionGroupBFromRule should return value', (done: DoneFn) => {
    service.getConditionGroupBFromRule(mock.generateRule('1')).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getGeneFromCondition should return value', (done: DoneFn) => {
    service.getGeneFromCondition(mock.generateCondition()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getGenesFromCondition should return value', (done: DoneFn) => {
    service.getGenesFromCondition(mock.generateCondition()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

});
