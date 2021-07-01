import { Injectable, OnDestroy } from '@angular/core';
import {Gene, Mutation} from '../../models/genetic-model';
import { GeneticMock } from './genetic.mock';
import {BehaviorSubject, forkJoin, Observable, of, Subscription} from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Index } from '../../models/authentication-model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { HalObject, Pagination } from '../../models/common-model';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { Promise } from 'es6-promise';

@Injectable({ providedIn: 'root' })
export class MutationService implements OnDestroy {

  index: Index;
  indexSubscription: Subscription;

  mutationSubject: BehaviorSubject<Mutation>;
  mutation: Observable<Mutation>;

  mutationListSubject: BehaviorSubject<Array<Mutation>>;
  mutationList: Observable<Array<Mutation>>;

  mutationHalObject: Observable<HalObject>;

  mutationSmartSearchSubscription: Subscription;

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
      console.log('Mutation service - recovering index from service');
      this.index = indexData as Index;
      console.log('Mutation service - recovered index: ' + this.index.groupsUrl);
    });
  }

  ngOnDestroy(): void {
    console.log('Mutation service - destroying');
    if (this.indexSubscription !== undefined) {
      this.indexSubscription.unsubscribe();
    }
  }

  listMutations(): Observable<Array<Mutation>> {
    if (environment.backendConnection) {
      this.mutationList = this.http.get<Array<Mutation>>(this.index.mutationsUrl, this.httpOptions)/*.pipe(
          map(data => data[environment.embedded][environment.linksMutations] as Array<Mutation>)
      )*/;
      console.log('Mutation service - recovered mutations');
      return this.mutationList;
    } else {
      return of(this.geneticMock.generateMutationList());
    }
  }

  patchMutation(mutation: Mutation): Observable<Mutation> {
    if (environment.backendConnection) {
        const result: Mutation = null;
        return this.http.patch<Mutation>(this.index.mutationsUrl + '/' + mutation.id, this.changeStatus(mutation), this.httpOptions);
    } else {
        return of(mutation);
    }
  }

  listMutationPagination(pagination: Pagination): Observable<HalObject> {
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

      this.mutationHalObject = this.http.get<HalObject>(this.index.mutationsUrl, { params }).pipe(
          map(data => data as HalObject)
      );
      console.log('Mutation service - recovered hal object genes');
      return this.mutationHalObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksMutations, this.geneticMock.generateMutationList());
      return of(halObject);
    }
  }

  getMutationByParameter(pagination: Pagination, parameter: string): Observable<HalObject> {
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

      const url = this.index.mutationsSearchUrl;
      return this.http.get<HalObject>(url, { params });
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksMutations, this.geneticMock.generateMutationList());
      return of(halObject);
    }
  }

  getMutationGene(mutation: Mutation): Observable<Gene>{
    if (environment.backendConnection) {
      return this.http.get<Gene>(mutation._links['precon:mutation-gene'].href, this.httpOptions);
    } else {
      return of(this.geneticMock.generateGene('1'));
    }
  }

  public changeStatus(mutation: Mutation): Mutation {
      mutation.active = !mutation.active;
      return mutation;
  }
}
