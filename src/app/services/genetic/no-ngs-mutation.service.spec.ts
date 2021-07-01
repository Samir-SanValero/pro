import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoNgsMutationService } from './no-ngs-mutation.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('NoNgsMutationServiceTest', () => {
  let service: NoNgsMutationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
                RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(NoNgsMutationService);
  });

  it('NoNgsMutationService should be created', () => {
    expect(service).toBeTruthy();
  });

});
