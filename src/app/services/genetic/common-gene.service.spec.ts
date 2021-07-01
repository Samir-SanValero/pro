import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonGeneService } from './common-gene.service';

describe('CommonGeneServiceTest', () => {
  let service: CommonGeneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(CommonGeneService);
  });

  it('CommonGeneService should be created', () => {
    expect(service).toBeTruthy();
  });

});
