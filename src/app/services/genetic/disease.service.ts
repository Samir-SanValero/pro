import { Injectable, OnDestroy } from '@angular/core';
import { Disease, Gene, ApiRequest } from '../../models/genetic-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GeneticMock } from './genetic.mock';
import { map } from 'rxjs/operators';
import { Index } from '../../models/authentication-model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Translation } from '../../models/administrative-model';
import { HalObject, Pagination } from '../../models/common-model';
import { AdministrativeMock } from '../administrative/administrative.mock';

@Injectable({ providedIn: 'root' })
export class DiseaseService implements OnDestroy {

  index: Index;
  indexSubscription: Subscription;

  diseaseSubject: BehaviorSubject<Disease>;
  disease: Observable<Disease>;

  diseaseListSubject: BehaviorSubject<Array<Disease>>;
  diseaseList: Observable<Array<Disease>>;

  diseaseHalObject: Observable<HalObject>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/hal+json'
    })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              public geneticMock: GeneticMock,
              public administrativeMock: AdministrativeMock) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      console.log('Disease service - recovering index from service');
      this.index = indexData as Index;
      console.log('Disease service - recovered index: ' + this.index.diseasesUrl);
    });
  }

  ngOnDestroy(): void {
    console.log('Group service - destroying');
    if (this.indexSubscription !== undefined) {
      this.indexSubscription.unsubscribe();
    }
  }

  getDisease(diseaseId: number): Observable<Disease> {
    if (environment.backendConnection) {
      return this.http.get<Disease>(this.index.diseasesUrl + '/' + diseaseId, this.httpOptions);
    } else {
      const result: Disease = new Disease();
      result.id = diseaseId;
      return of(result);
    }
  }

  getDiseaseByParameter(pagination: Pagination, parameter: string): Observable<HalObject> {
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

      let url = this.index.diseasesSearchUrl;

      if (parameter === 'name') {
        url = url + 'findByDiseaseName';
      } else  if (parameter === 'omim') {
        url = url + 'findByOmim';
      }

      console.log('url: ' + url);
      console.log('textFilter:' + pagination.textFilter);
      console.log('textField:' + pagination.textField);
      console.log('sortOrder:' + pagination.sortOrder);
      console.log('sortField:' + pagination.sortField);

      return this.http.get<HalObject>(url, { params });
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksDiseases, this.geneticMock.generateDiseaseList());
      return of(halObject);
    }
  }

  listDiseases(): Observable<Array<Disease>> {
    if (environment.backendConnection) {
      this.diseaseList = this.http.get<Array<Disease>>(this.index.diseasesUrl, this.httpOptions).pipe(
        map(data => data[environment.embedded][environment.linksDiseases] as Array<Disease>)
      );
      console.log('Disease service - recovered diseases');
      return this.diseaseList;
    } else {
      const requestList = this.geneticMock.generateDiseaseList();
      console.log(requestList);
      return of(requestList);
    }
  }

  listDiseasePagination(pagination: Pagination): Observable<HalObject> {
    console.log('Group service - listing groups');
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

      this.diseaseHalObject = this.http.get<HalObject>(this.index.diseasesUrl, { params }).pipe(
          map(data => data as HalObject)
      );
      console.log('Disease service - recovered hal object genes');
      return this.diseaseHalObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksDiseases, this.geneticMock.generateDiseaseList());
      return of(halObject);
    }
  }

  updateDisease(disease: Disease): Observable<Disease> {
     if (environment.backendConnection) {
       return this.http.put<Disease>(this.index.diseasesUrl + '/' + disease.id, disease, this.httpOptions);
     } else {
       return of(disease);
     }
   }

  getDiseaseGenes(diseaseId: number): Observable<Array<Gene>> {
    if (environment.backendConnection) {
      return this.http.get<Array<Gene>>(this.index.diseasesUrl + '/' + diseaseId + '/genes', this.httpOptions).pipe(
        map(data => data[environment.embedded][environment.linksGenes] as Array<Gene>));
    } else {
      return of (new Array<Gene>(new Gene()));
    }
  }

  /**
   * Only for get requests
   */
  getUrlApiRestV3 <T>(url: string, type: new() => T): Observable<ApiRequest<T>> {
    if (environment.backendConnection) {
        return this.http.get<ApiRequest<T>>(url, this.httpOptions) as Observable<ApiRequest<T>>;
    } else {
        const result: ApiRequest <T> = new ApiRequest<T>();
        const array: Array<T> = new Array<T>();
        const variableType: T = new type();
        array.push(variableType);
        result._embedded = { href: array };
        return of(result);
    }
  }

}
