import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GenotypeService } from './genotype.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('GenotypeServiceTest', () => {
  let service: GenotypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
                RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(GenotypeService);
  });

  it('GenotypeService should be created', () => {
    expect(service).toBeTruthy();
  });

});
