import { Injectable } from '@angular/core';
import { Bank, Ethnicity, MatchRequest, Request } from '../../models/administrative-model';
import { Observable, of, Subscription } from 'rxjs';
import { Index } from '../../models/authentication-model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { map } from 'rxjs/operators';
import { AdministrativeMock } from './administrative.mock';
import { environment } from '../../../environments/environment';
import { HalObject, Pagination } from '../../models/common-model';
import { ApiRequest } from '../../models/genetic-model';
import {TranslateService} from '@ngx-translate/core';
import {CoupleMatchReportStatus, IndividualReportStatus, SomeDonorsReportStatus} from '../../models/report-model';

@Injectable({ providedIn: 'root' })
export class RequestService {
  index: Index;
  indexSubscription: Subscription;

  request: Observable<Request>;

  requestHalObject: Observable<HalObject>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              private administrativeMock: AdministrativeMock,
              private translateService: TranslateService) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      this.index = indexData as Index;

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept-Language': translateService.currentLang
        })
      };
    });
  }

  getPartnerRequest(partnerRequestUrl: string): Observable<Request> {
    console.log('Request service - getting partner request');
    if (environment.backendConnection) {
      const partner = this.http.get<Request>(partnerRequestUrl, this.httpOptions).pipe(
          map(data => data as Request)
      );
      console.log('Request service - recovered hal object groups');
      return partner;
    } else {
      return of(this.administrativeMock.generateRequest('1'));
    }
  }

  getMatchableBanks(request: Request): Observable<HalObject> {
    console.log('Request service - getting partner request');
    if (environment.backendConnection) {
      const partner = this.http.get<HalObject>(request._links['precon:matchable-banks'].href, this.httpOptions).pipe(
        map(data => data as HalObject)
      );
      console.log('Request service - recovered hal object groups');
      return partner;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksBanks, this.administrativeMock.generateBankList());
      return of(halObject);
    }
  }

  //
  // getRequestByParameter(pagination: Pagination) {
  //   if (environment.backendConnection) {
  //     let params = new HttpParams();
  //     params = params.append('term', pagination.textFilter);
  //     if (pagination.currentPag !== undefined) {
  //       params = params.append(environment.setPageNumber, pagination.currentPag.toString());
  //     }
  //
  //     if (pagination.currentPagSize !== undefined) {
  //       params = params.append(environment.setPageSize, pagination.currentPagSize.toString());
  //     }
  //
  //     if (pagination.sortField !== undefined && pagination.sortOrder !== undefined &&
  //       pagination.sortField !== null && pagination.sortOrder !== null &&
  //       pagination.sortField !== '' && pagination.sortOrder !== '') {
  //       params = params.append(environment.setSortOrder, pagination.sortField + ',' + pagination.sortOrder);
  //     }
  //
  //     let url = this.index.requestsSearchUrl + 'findByTerm';
  //
  //     console.log('url: ' + url);
  //     console.log('textFilter:' + pagination.textFilter);
  //     console.log('textField:' + pagination.textField);
  //     console.log('sortOrder:' + pagination.sortOrder);
  //     console.log('sortField:' + pagination.sortField);
  //
  //     return this.http.get<HalObject>(url, { params });
  //   } else {
  //     const halObject = this.administrativeMock.generateHalObject(environment.linksRequests,
  //     this.administrativeMock.generateRequestList());
  //     return of(halObject);
  //   }
  // }

  getRequestByCode(code: string): Observable<ApiRequest<Request>> {
    if (environment.backendConnection) {
      return this.http.get<ApiRequest<Request>>(this.index.requestsUrl + '/' + code);
    } else {
      const request = this.administrativeMock.generateRequest('1');
      const result: ApiRequest <Request> = new ApiRequest<Request>();
      const array: Array<Request> = new Array<Request>();
      array.push(request);
      result._embedded = { href: array };
      return of(result);
    }
  }

  getRequestByUrCode(urCode: string): Observable<ApiRequest<Request>> {
    if (environment.backendConnection) {
      return this.http.get<ApiRequest<Request>>(this.index.requestsUrl + '/search/findByUrCode?urCode=' + urCode);
    } else {
      const request = this.administrativeMock.generateRequest('1');
      const result: ApiRequest <Request> = new ApiRequest<Request>();
      const array: Array<Request> = new Array<Request>();
      array.push(request);
      result._embedded = { href: array };
      return of(result);
    }
  }

  getRequestByExtCode(extCode: string): Observable<Request> {
    if (environment.backendConnection) {

    } else {
      const request = this.administrativeMock.generateRequest('1');
      return of(request);
    }
  }

  getRequestByFirstName(firstName: string): Observable<Request> {
    if (environment.backendConnection) {

    } else {
      const request = this.administrativeMock.generateRequest('1');
      return of(request);
    }
  }

  getRequestByLastName(lastName: string): Observable<Request> {
    if (environment.backendConnection) {

    } else {
      const request = this.administrativeMock.generateRequest('1');
      return of(request);
    }
  }

  getRequestByParameter(pagination: Pagination, parameter: string): Observable<HalObject> {
    if (environment.backendConnection) {
      let params = new HttpParams();
      params = params.append(parameter, pagination.textFilter);
      if (pagination.currentPag !== undefined) {
        params = params.append(environment.setPageNumber, pagination.currentPag.toString());
      }

      if (pagination.currentPagSize !== undefined) {
        params = params.append(environment.setPageSize, pagination.currentPagSize.toString());
      }

      if (pagination.sortField !== undefined && pagination.sortOrder !== undefined &&
        pagination.sortField !== null && pagination.sortOrder !== null &&
        pagination.sortField !== '' && pagination.sortOrder !== '') {
        params = params.append(environment.setSortOrder, pagination.sortField + ',' + pagination.sortOrder);
      }

      let url = this.index.requestsSearchUrl;

      if (parameter === 'urCode') {
        url = url + 'findByUrCode';
      } else  if (parameter === 'extCode') {
        url = url + 'findByExtCode';
      } else  if (parameter === 'firstName') {
        url = url + 'findByFirstName';
      } else  if (parameter === 'lastName') {
        url = url + 'findByLastName';
      } else  if (parameter === 'bank') {
        url = url + 'findByBank';
      }

      console.log('url: ' + url);
      console.log('textFilter:' + pagination.textFilter);
      console.log('textField:' + pagination.textField);
      console.log('sortOrder:' + pagination.sortOrder);
      console.log('sortField:' + pagination.sortField);

      return this.http.get<HalObject>(url, { params });
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksRequests, this.administrativeMock.generateRequestList());
      return of(halObject);
    }
  }

  listRequestsPagination(pagination: Pagination): Observable<HalObject> {
    console.log('Request service - listing requests');
    if (environment.backendConnection) {
      let params = new HttpParams();
      if (pagination.currentPag !== undefined) {
        params = params.append(environment.setPageNumber, pagination.currentPag.toString());
      }

      if (pagination.currentPagSize !== undefined) {
        params = params.append(environment.setPageSize, pagination.currentPagSize.toString());
      }

      if (pagination.sortField !== undefined && pagination.sortOrder !== undefined) {
        params = params.append(environment.setSortOrder, pagination.sortField + ',' + pagination.sortOrder);
      }

      this.requestHalObject = this.http.get<HalObject>(this.index.requestsUrl, { params }).pipe(
          map(data => data as HalObject)
      );
      console.log('Request service - recovered hal object request');
      return this.requestHalObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksRequests, this.administrativeMock.generateRequestList());
      return of(halObject);
    }
  }

  listBankRequestsPagination(bank: Bank, pagination: Pagination): Observable<HalObject> {
    console.log('Request service - listing requests');
    if (environment.backendConnection) {
      let params = new HttpParams();
      if (pagination.currentPag !== undefined) {
        params = params.append(environment.setPageNumber, pagination.currentPag.toString());
      }

      if (pagination.currentPagSize !== undefined) {
        params = params.append(environment.setPageSize, pagination.currentPagSize.toString());
      }

      this.requestHalObject = this.http.get<HalObject>(
        this.index.requestsUrl + '/search/findByBank?bank=' +
        bank._links.self.href, { params }).pipe(
        map(data => data as HalObject)
      );
      console.log('Request service - recovered hal object request');
      return this.requestHalObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksRequests, this.administrativeMock.generateRequestList());
      return of(halObject);
    }
  }

  createRequest(request: Request): Observable<Request> {
    console.log('Request service - updating request');
    if (environment.backendConnection) {
      return this.http.post<Request>(this.index.requestsUrl, request, this.httpOptions).pipe(
          map(data => data as Request)
      );
    } else {
      return of(request);
    }
  }

  updateRequest(request: Request): Observable<Request> {
    console.log('Request service - updating request');

    const updateRequestHttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json-patch+json'
      })
    };

    if (environment.backendConnection) {
      return this.http.patch<Request>(request._links.self.href, request.generatePatchJson(), updateRequestHttpOptions).pipe(
          map(data => data as Request)
      );
    } else {
      return of(request);
    }
  }

  getRequestEthnicity(request: Request): Observable<Ethnicity> {
    if (environment.backendConnection) {

    } else {

    }
    const ethnicity = this.administrativeMock.generateEthnicity('1');
    return of(ethnicity);
  }

  addPartner(request: Request, partner: Request): Observable<any> {
    console.log('Request service - updating request');

    const httpPartnerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/uri-list'
      })
    };

    if (environment.backendConnection) {
      return this.http.put<Request>(partner._links.self.href + '/partner', request._links.self.href, httpPartnerOptions).pipe(
          map(data => data)
      );
    } else {
      return of(request);
    }
  }

  removePartner(request: Request): Observable<any> {
    if (environment.backendConnection) {
      return this.http.delete<Request>(request._links['precon:partner'].href, this.httpOptions).pipe(
          map(data => data)
      );
    } else {
      return of(request);
    }
  }

  getRequestMatches(request: Request): Observable<HalObject> {
    if (environment.backendConnection) {
      return this.http.get<HalObject>(request._links['precon:match-requests'].href, this.httpOptions).pipe(
        map(data => data)
      );
    } else {
      const halObject = this.administrativeMock.generateHalObject(
        environment.linksMatchRequests,
        this.administrativeMock.generateMatchRequestList());
      return of(halObject);
    }
  }

  getMatchRequestReport(matchRequest: MatchRequest): Observable<string> {
    if (environment.backendConnection) {
      return this.http.get<string>(matchRequest._links['precon:report'].href, this.httpOptions).pipe(
        map(data => data)
      );
    } else {
      return of('JVBERi0xLjAKMSAwIG9iajw8L1BhZ2VzIDIgMCBSPj5lbmRvYmogMiAwIG9iajw8L0tpZHNbMyAw\\nIFJdL0NvdW50IDE+PmVuZG9iaiAz' +
                'IDAgb2JqPDwvTWVkaWFCb3hbMCAwIDMgM10+PmVuZG9iagp0\\ncmFpbGVyPDwvUm9vdCAxIDAgUj4+Cg==');
    }
  }

  getIndividualReport(request: Request): Observable<IndividualReportStatus> {
    if (environment.backendConnection) {
      return this.http.get<IndividualReportStatus>(request._links['precon:individual-report-status'].href, this.httpOptions).pipe(
        map(data => data)
      );
    } else {
      return of(new IndividualReportStatus());
    }
  }

  getCoupleReport(request: Request): Observable<CoupleMatchReportStatus> {
    if (environment.backendConnection) {
      return this.http.get<CoupleMatchReportStatus>(request._links['precon:individual-report-status'].href, this.httpOptions).pipe(
        map(data => data)
      );
    } else {
      return of(new CoupleMatchReportStatus());
    }
  }

  getDonorReport(request: Request): Observable<SomeDonorsReportStatus> {
    if (environment.backendConnection) {
      return this.http.get<SomeDonorsReportStatus>(request._links['precon:individual-report-status'].href, this.httpOptions).pipe(
        map(data => data)
      );
    } else {
      return of(new SomeDonorsReportStatus());
    }
  }

  downloadReport(link: string) {
    if (environment.backendConnection) {
      return this.http.get<string>(link, this.httpOptions).pipe(
        map(data => data)
      );
    } else {
      return of('JVBERi0xLjAKMSAwIG9iajw8L1BhZ2VzIDIgMCBSPj5lbmRvYmogMiAwIG9iajw8L0tpZHNbMyAw\\nIFJdL0NvdW50IDE+PmVuZG9iaiAz' +
        'IDAgb2JqPDwvTWVkaWFCb3hbMCAwIDMgM10+PmVuZG9iagp0\\ncmFpbGVyPDwvUm9vdCAxIDAgUj4+Cg==');
    }
  }

  // toggleCnv(cnv: CnvRequest): void {
  //   if (environment.backendConnection) {
  //     return this.http.get<CnvRequest>(matchRequest._links['precon:report'].href, this.httpOptions).pipe(
  //       map(data => data)
  //     );
  //   } else {
  //
  //   }
  // }

}

