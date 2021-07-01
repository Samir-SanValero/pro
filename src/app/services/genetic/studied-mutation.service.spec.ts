import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudiedMutationService } from './studied-mutation.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('StudiedMutationServiceTest', () => {
  let service: StudiedMutationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
                RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(StudiedMutationService);
  });

  it('StudiedMutationService should be created', () => {
    expect(service).toBeTruthy();
  });

});
