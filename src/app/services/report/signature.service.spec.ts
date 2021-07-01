import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignatureService } from './signature.service';

describe('SignatureServiceTest', () => {
  let service: SignatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(SignatureService);
  });

  it('SignatureService should be created', () => {
    expect(service).toBeTruthy();
  });

});
