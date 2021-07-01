import { Injectable, OnDestroy } from '@angular/core';
import { CommonGene, ExternalRequestGene, Gene, ApiRequest, Disease } from '../../models/genetic-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { GeneticMock } from './genetic.mock';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Index } from '../../models/authentication-model';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { HalObject, Pagination } from '../../models/common-model';

@Injectable({ providedIn: 'root' })
export class GeneService implements OnDestroy {

  index: Index;
  indexSubscription: Subscription;

  geneSubject: BehaviorSubject<Gene>;
  gene: Observable<Gene>;

  geneListSubject: BehaviorSubject<Array<Gene>>;
  geneList: Observable<Array<Gene>>;

  geneHalObject: Observable<HalObject>;

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
      console.log('Group service - recovering index from service');
      this.index = indexData as Index;
    });
  }

  ngOnDestroy(): void {
    console.log('Group service - destroying');
    if (this.indexSubscription !== undefined) {
      this.indexSubscription.unsubscribe();
    }
  }

  getExternalRequest(externalRequestId: number): ExternalRequestGene {
    if (environment.backendConnection) {

    } else {
      const externalRequestGene: ExternalRequestGene = new ExternalRequestGene();
      externalRequestGene.id = externalRequestId;
      return externalRequestGene;
    }
  }

  listGenes(): Observable<Array<Gene>>{
    if (environment.backendConnection) {
      this.geneList = this.http.get<Array<Gene>>(this.index.genesUrl, this.httpOptions).pipe(
          map(data => data[environment.embedded][environment.linksGenes] as Array<Gene>)
      );
      console.log('Gene service - recovered genes');
      return this.geneList;
    } else {
      const externalRequestList = this.geneticMock.generateGeneList();
      return of(externalRequestList);
    }
  }

  listGenesPagination(pagination: Pagination): Observable<HalObject> {
    console.log('Gene service - listing genes');
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

      this.geneHalObject = this.http.get<HalObject>(this.index.genesUrl, { params }).pipe(
          map(data => data as HalObject)
      );
      console.log('Gene service - recovered hal object genes');
      return this.geneHalObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksGenes, this.geneticMock.generateGeneList());
      return of(halObject);
    }
  }

  createExternalRequestGene(commonGene: CommonGene, externalRequestId: number): void {
    if (environment.backendConnection) {

    } else {

    }
  }

  deleteExternalRequestGene(commonGene: CommonGene, externalRequestId: number): void {
    if (environment.backendConnection) {

    } else {

    }
  }

  getGeneByRequestAndGene(requestId: number, geneId: number): CommonGene {
    if (environment.backendConnection) {

    } else {
      const cGene: CommonGene = new CommonGene();
      cGene.id = geneId;
      return cGene;
    }
  }

  getDiseaseRelated(geneId: number): Observable<Array<Disease>> {
      if (environment.backendConnection) {
          return this.http.get<Array<Disease>>(environment.apiUrl + '/diseases/' + geneId + '/genes' , this.httpOptions);
      } else {
          return of (new Array<Disease>());
      }
  }

  getGeneByParameter(pagination: Pagination, parameter: string): Observable<HalObject> {
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

      let url = this.index.genesSearchUrl;

      if (parameter === 'name') {
        url = url + 'findByName';
      }

      console.log('url: ' + url);
      console.log('textFilter:' + pagination.textFilter);
      console.log('textField:' + pagination.textField);
      console.log('sortOrder:' + pagination.sortOrder);
      console.log('sortField:' + pagination.sortField);

      return this.http.get<HalObject>(url, {params});
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksGenes, this.geneticMock.generateGeneList());
      return of(halObject);
    }
  }
}
