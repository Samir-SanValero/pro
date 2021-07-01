import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RequestService } from './request.service';
import { Request } from '../../models/administrative-model';
import { RouterTestingModule } from '@angular/router/testing';
import { AdministrativeMock } from './administrative.mock';
import { Pagination } from '../../models/common-model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('RequestServiceTest', () => {
  let service: RequestService;
  let mock: AdministrativeMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [HttpClient, TranslateService]
    });
    service = TestBed.inject(RequestService);
    mock = TestBed.inject(AdministrativeMock);
  });

  it('EthnicityService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#listRequestsPagination should return value', (done: DoneFn) => {
    service.listRequestsPagination(new Pagination()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#createRequest should return value', (done: DoneFn) => {
    service.createRequest(mock.generateRequest('1')).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#updateRequest should return value', (done: DoneFn) => {
    service.updateRequest(mock.generateRequest('1')).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getRequestEthnicity should return value', (done: DoneFn) => {
    service.getRequestEthnicity(new Request()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

});
