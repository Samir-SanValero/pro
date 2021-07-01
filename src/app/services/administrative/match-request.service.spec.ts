import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatchRequestService } from './match-request.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('MatchRequestServiceTest', () => {
  let service: MatchRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(MatchRequestService);
  });

  it('EthnicityService should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('#listMatchRequestByRequest should return value', (done: DoneFn) => {
  //   service.listMatchRequestByRequest('1').subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#createMatchRequest should return value', (done: DoneFn) => {
  //   service.createMatchRequest().subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#listGroups should return value', (done: DoneFn) => {
  //   service.updateMatchRequest().subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#listMatchRequestByRequest should return value', (done: DoneFn) => {
  //   service.createReport('1').subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#listMatchRequestByRequest should return value', (done: DoneFn) => {
  //   service.addTargetRequestToMatchRequest().subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#replaceTargetRequestOfMatchRequest should return value', (done: DoneFn) => {
  //   service.replaceTargetRequestOfMatchRequest('1').subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

});
