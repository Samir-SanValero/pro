import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CnvRequestService } from './cnv-request.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Pagination } from '../../models/common-model';

describe('CnvRequestServiceTest', () => {
  let service: CnvRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(CnvRequestService);
  });

  it('CnvRequestService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getCnvRequest should return value', (done: DoneFn) => {
    service.getCnvRequest(1).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getCnvRequest should return value', (done: DoneFn) => {
    service.getCnvRequestByGenotype(null).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getCnvRequestByRequestId should return value', (done: DoneFn) => {
    service.getCnvRequestByRequestId(1).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getCnvRequestByRequestIdAndGeneId should return value', (done: DoneFn) => {
    service.getCnvRequestByRequestIdAndGeneId(1, 1).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getUncoveredCnvRequestByRequestId should return value', (done: DoneFn) => {
    service.getUncoveredCnvRequestByRequestId(1).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getUncoveredCnvRequestByRequestIdAndGeneId should return value', (done: DoneFn) => {
    service.getUncoveredCnvRequestByRequestIdAndGeneId(1, 1).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  // it('#getCnvRequestInXByMatchResult should return value', (done: DoneFn) => {
  //   service.getCnvRequestInXByMatchResult( new MatchResult()).subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#getUncoveredCnvRequestInXByMatchResult should return value', (done: DoneFn) => {
  //   service.getUncoveredCnvRequestInXByMatchResult('1').subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  it('#listCnvsRequestsPagination should return value', (done: DoneFn) => {
    service.listCnvsRequestsPagination(new Pagination()).subscribe(value => {
      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#patchCnv should return value', (done: DoneFn) => {
      service.patchCnv(null).subscribe(value => {
        // Value exists
        expect(value).toBeDefined();

        done();
      });
    });

});
