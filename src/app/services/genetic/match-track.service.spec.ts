import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatchTrackService } from './match-track.service';

describe('MatchTrackServiceTest', () => {
  let service: MatchTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(MatchTrackService);
  });

  it('MatchTrackService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getMatchTrack should return value', (done: DoneFn) => {
    service.getMatchTrack('1').subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listMatchTracksByRequestId should return value', (done: DoneFn) => {
    service.listMatchTracksByRequestId(1).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

});
