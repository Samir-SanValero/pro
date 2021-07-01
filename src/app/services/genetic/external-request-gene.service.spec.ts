import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExternalRequestGeneService } from './external-request-gene.service';

describe('ExternalRequestGeneServiceTest', () => {
  let service: ExternalRequestGeneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(ExternalRequestGeneService);
  });

  it('ExternalRequestGeneService should be created', () => {
    expect(service).toBeTruthy();
  });

});
