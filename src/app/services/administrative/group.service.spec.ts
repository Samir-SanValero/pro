import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GroupService } from './group.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DonorRequest } from '../../models/administrative-model';
import { Pagination } from '../../models/common-model';

describe('GroupServiceTest', () => {
  let service: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(GroupService);
  });

  it('GroupService should be created', () => {

    expect(service).toBeTruthy();
  });

  it('#getGroup should return value', (done: DoneFn) => {
    service.getGroup(1).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getGroupByDonorRequest should return value', (done: DoneFn) => {
    service.getGroupByDonorRequest(new DonorRequest()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listGroups should return value', (done: DoneFn) => {
    service.listGroups().subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listGroupsPagination should return value', (done: DoneFn) => {
    service.listGroupsPagination(new Pagination()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

});
