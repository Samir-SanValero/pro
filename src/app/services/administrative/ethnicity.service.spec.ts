import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EthnicityService } from './ethnicity.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AdministrativeMock } from './administrative.mock';
import { AuthenticationService } from '../authentication/authentication.service';

describe('EthnicityServiceTest', () => {
  let mock: AdministrativeMock;
  let service: EthnicityService;
  let authService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(EthnicityService);
    authService = TestBed.inject(AuthenticationService);
    service.authenticationService = authService;

    mock = TestBed.inject(AdministrativeMock);
  });

  it('EthnicityService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#listEthnicities should return value', (done: DoneFn) => {
    service.listEthnicities().subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#listEthnicitiesByRequest should return value', (done: DoneFn) => {
    const request = mock.generateRequest('1');
    service.listEthnicitiesByRequest(request._links['precon:ethnicities'].href).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

  it('#getEthnicityOfRequest should return value', (done: DoneFn) => {
    const request = mock.generateRequest('1');
    service.getEthnicityOfRequest(request._links['precon:ethnicity'].href).subscribe(value => {

      // Value exists
      expect(value).toBeDefined();

      done();
    });
  });

});
