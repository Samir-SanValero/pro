import { BankService } from './bank.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdministrativeMock } from './administrative.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Pagination } from '../../models/common-model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Bank } from 'src/app/models/administrative-model';

describe('BankServiceTest', () => {
  let service: BankService;
  let mock: AdministrativeMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        HttpClient,
        TranslateService
      ]
    });
    service = TestBed.inject(BankService);
    mock = TestBed.inject(AdministrativeMock);
  });

  it('BankService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createBank should return value', (done: DoneFn) => {
    service.createBank(mock.generateBank('1')).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#createBank should return type Bank', (done: DoneFn) => {

    service.createBank(mock.generateBank('1')).subscribe(value => {

      // Value is type Observable
      expect(value instanceof Bank).toBe(true);

      done();
    })
  })

  it('#updateBank should return value', (done: DoneFn) => {
    service.updateBank(mock.generateBank('1')).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#updateBank should return type Bank', (done: DoneFn) => {

    service.updateBank(mock.generateBank('1')).subscribe(value => {

      // Value is type Observable
      expect(value instanceof Bank).toBe(true);

      done();
    })
  })

  it('#deleteBank should return value', (done: DoneFn) => {
    service.deleteBank(mock.generateBank('1')).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getBank should return value with required properties', (done: DoneFn) => {
    service.getBank(1).subscribe(value => {

        // Value exists
        expect(value).toBeDefined();

        // Required properties
        expect(value.code).toBeDefined();
        expect(value.name).toBeDefined();
        expect(value.groupCode).toBeDefined();
        expect(value.description).toBeDefined();
        expect(value.active).toBeDefined();
        expect(value.containsExternalRequests).toBeDefined();

        done();
    });
  });

  it('#listBanks should return value', (done: DoneFn) => {
    service.listBanks().subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listBanksPagination should return value', (done: DoneFn) => {
    service.listBanksPagination(new Pagination()).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getBankRequests should return value', (done: DoneFn) => {
    service.getBankRequests(1).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

});
