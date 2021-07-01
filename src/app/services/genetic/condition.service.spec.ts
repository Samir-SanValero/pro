import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConditionService } from './condition.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ConditionServiceTest', () => {
  let service: ConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [HttpClient, TranslateService]
    });
    service = TestBed.inject(ConditionService);
  });

  it('ConditionService should be created', () => {
    expect(service).toBeTruthy();
  });

});
