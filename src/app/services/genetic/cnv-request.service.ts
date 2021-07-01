import { Injectable } from '@angular/core';
import {CnvRequest, ApiRequest, Genotype, Mutation, Gene} from '../../models/genetic-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { GeneticMock } from './genetic.mock';
import { environment } from '../../../environments/environment';
import { Index } from '../../models/authentication-model';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { AuthenticationService } from '../authentication/authentication.service';
import { HalObject, Pagination } from '../../models/common-model';

@Injectable({ providedIn: 'root' })
export class CnvRequestService {

  index: Index;
  indexSubscription: Subscription;

  cnvSubject: BehaviorSubject<CnvRequest>;
  cnv: Observable<CnvRequest>;

  cnvListSubject: BehaviorSubject<Array<CnvRequest>>;
  cnvList: Observable<Array<CnvRequest>>;

  cnvHalObject: Observable<HalObject>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/hal+json'
    })
  };

  constructor(private http: HttpClient,
              public geneticMock: GeneticMock,
              public administrativeMock: AdministrativeMock,
              public authenticationService: AuthenticationService) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      console.log('Group service - recovering index from service');
      this.index = indexData as Index;

    });
  }

  getCnvRequest(cnvRequestId: number): Observable<CnvRequest> {
    if (environment.backendConnection) {

    } else {
      const cnv = this.geneticMock.generateCnvRequest(cnvRequestId.toString());
      return of(cnv);
    }
  }

  getCnvRequestByGenotype(genotype: Genotype): Observable<HalObject> {
    if (environment.backendConnection) {
      return this.http.get<HalObject>(genotype._links['precon:cnvs'].href, this.httpOptions).pipe();
    } else {
      return of(this.administrativeMock.generateHalObject('precon:cnv_requests', this.geneticMock.generateCnvRequestList()));
    }
  }

  getCnvRequestByRequestId(requestId: number): Observable<CnvRequest> {
    if (environment.backendConnection) {

    } else {
      const cnv = this.geneticMock.generateCnvRequest(requestId.toString());
      return of(cnv);
    }
  }

  getCnvRequestByRequestIdAndGeneId(requestId: number, geneId: number): Observable<CnvRequest> {
    if (environment.backendConnection) {

    } else {
      const cnv = this.geneticMock.generateCnvRequest(requestId.toString());
      return of(cnv);
    }
  }

  getUncoveredCnvRequestByRequestId(requestId: number): Observable<CnvRequest> {
    if (environment.backendConnection) {

    } else {
      const cnv = this.geneticMock.generateCnvRequest(requestId.toString());
      return of(cnv);
    }
  }

  getUncoveredCnvRequestByRequestIdAndGeneId(requestId: number, geneId: number): Observable<CnvRequest> {
    if (environment.backendConnection) {

    } else {
      const cnv = this.geneticMock.generateCnvRequest(requestId.toString());
      return of(cnv);
    }
  }

  /*listCnvsRequests(): Observable<ApiRequest<CnvRequest>> {
    if (environment.backendConnection) {
      return this.http.get<ApiRequest<CnvRequest>>(this.index.cnvsUrl, this.httpOptions);
    } else {
      return of(this.geneticMock.generateCnvRequestList());
    }
  }*/

  listCnvsRequestsPagination(pagination: Pagination): Observable<HalObject> {
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

      this.cnvHalObject = this.http.get<HalObject>(this.index.cnvsUrl, { params }).pipe(
          map(data => data as HalObject)
      );

      console.log('CnvRequest service - recovered hal object');
      return this.cnvHalObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksCnvs, this.geneticMock.generateCnvRequestList());
      return of(halObject);
    }
  }

  patchCnv(cnvRequest: CnvRequest): Observable<CnvRequest> {
    if (environment.backendConnection) {
      return this.http.patch<CnvRequest>(this.index.cnvsUrl + '/' + cnvRequest.id, this.changeStatus(cnvRequest), this.httpOptions);
    } else {
      return of(new CnvRequest());
    }
  }

  getCnvByParameter(pagination: Pagination, parameter: string): Observable<HalObject> {
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

      let url = this.index.cnvsSearchUrl;

      if (parameter === 'transcript') {
        url = url + 'findByTranscript';
      }

      console.log('url: ' + url);
      console.log('textFilter:' + pagination.textFilter);
      console.log('textField:' + pagination.textField);
      console.log('sortOrder:' + pagination.sortOrder);
      console.log('sortField:' + pagination.sortField);

      return this.http.get<HalObject>(url, { params });
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksCnvs, this.geneticMock.generateCnvRequestList());
      return of(halObject);
    }

  }

  getCnvGene(cnv: CnvRequest): Observable<Gene>{
    if (environment.backendConnection) {
      return this.http.get<Gene>(cnv._links['precon:gene'].href, this.httpOptions);
    } else {
      return of(this.geneticMock.generateGene('1'));
    }
  }

  private changeStatus(cnv: CnvRequest): CnvRequest {
      cnv.active = !cnv.active;
      return cnv;
  }

}
