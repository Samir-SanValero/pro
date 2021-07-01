import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemplateFavouriteService } from './template-favourite.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('TemplateFavouriteServiceTest', () => {
  let service: TemplateFavouriteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [HttpClient, TranslateService]
    });
    service = TestBed.inject(TemplateFavouriteService);
  });

  it('TemplateFavouriteService should be created', () => {
    expect(service).toBeTruthy();
  });

});
