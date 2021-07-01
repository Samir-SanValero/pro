import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatchResultService } from './match-result.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('MatchResultServiceTest', () => {
  let service: MatchResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(MatchResultService);
  });

  it('MatchResultService should be created', () => {
    expect(service).toBeTruthy();
  });

});
