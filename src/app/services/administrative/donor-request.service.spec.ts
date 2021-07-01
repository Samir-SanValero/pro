import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DonorRequestService } from './donor-request.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DonorRequestServiceTest', () => {
  let service: DonorRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(DonorRequestService);
  });

  it('DonorRequestService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#listDonorRequestByRequest should return value', (done: DoneFn) => {
    service.listDonorRequestByRequest(1).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listRequestedDonorRequest should return value', (done: DoneFn) => {
    service.listRequestedDonorRequest().subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listReceivedDonorRequest should return value', (done: DoneFn) => {
    service.listReceivedDonorRequest().subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  // it('#createDonorRequest should return value',
  // (done: DoneFn) => {
  //   service.createDonorRequest().subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#updateDonorRequest should return value',
  // (done: DoneFn) => {
  //   service.updateDonorRequest().subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

});
