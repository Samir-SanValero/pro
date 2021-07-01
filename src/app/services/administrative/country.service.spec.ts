import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CountryService } from './country.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AdministrativeMock } from './administrative.mock';

describe('CountryServiceTest', () => {
  let mock: AdministrativeMock;
  let service: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(CountryService);
    mock = TestBed.inject(AdministrativeMock);
  });

  it('CountryService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('REQ-1 #listCountries should return value', (done: DoneFn) => {
    service.listCountries().subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listCountriesByRequest should return value', (done: DoneFn) => {
    const request = mock.generateRequest('1');
    service.listCountriesByRequest(request._links['precon:countries'].href).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getCountryOfRequest should return value', (done: DoneFn) => {
    const request = mock.generateRequest('1');
    service.getCountryOfRequest(request._links['precon:country'].href).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listAllCountriesByRequest should return value', (done: DoneFn) => {
    service.listAllCountriesByRequest('').subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

});
