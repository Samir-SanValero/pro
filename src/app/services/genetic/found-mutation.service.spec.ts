import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FoundMutationService } from './found-mutation.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FoundMutationServiceTest', () => {
  let service: FoundMutationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
                RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(FoundMutationService);
  });

  it('FoundMutationService should be created', () => {
    expect(service).toBeTruthy();
  });

});
