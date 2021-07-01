import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActionService } from './action.service';
import { GeneticMock } from './genetic.mock';
import { Rule } from '../../models/genetic-model';

describe('ActionServiceTest', () => {
  let service: ActionService;
  let mock: GeneticMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(ActionService);
    mock = TestBed.inject(GeneticMock);
  });

  it('ActionService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getActionById should return value', (done: DoneFn) => {
    service.getActionById('1').subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#createAction should return value', (done: DoneFn) => {
    service.getActionById('1').subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listActionsByRule should return value', (done: DoneFn) => {
    service.listActionsByRule(new Rule()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#createAction should return value', (done: DoneFn) => {
    service.getActionById('1').subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });
});
