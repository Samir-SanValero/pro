import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UncoveredMutationService } from './uncovered-mutation.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('UncoveredMutationServiceTest', () => {
  let service: UncoveredMutationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
                RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(UncoveredMutationService);
  });

  it('UncoveredMutationService should be created', () => {
    expect(service).toBeTruthy();
  });

});
