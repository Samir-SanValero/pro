import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemplateService } from './template.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('TemplateServiceTest', () => {
  let service: TemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [HttpClient, TranslateService]
    });
    service = TestBed.inject(TemplateService);
  });

  it('TemplateService should be created', () => {
    expect(service).toBeTruthy();
  });

});
