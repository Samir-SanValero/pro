import { Injectable, OnDestroy } from '@angular/core';
import { DonorRequest, Group } from '../../models/administrative-model';
import { AuthenticationService } from '../authentication/authentication.service';
import { Index } from '../../models/authentication-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AdministrativeMock } from './administrative.mock';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { HalObject, Pagination } from '../../models/common-model';

@Injectable({ providedIn: 'root' })
export class GroupService implements OnDestroy {

  index: Index;
  indexSubscription: Subscription;

  groupSubject: BehaviorSubject<Group>;
  group: Observable<Group>;

  groupListSubject: BehaviorSubject<Array<Group>>;
  groupList: Observable<Array<Group>>;

  groupHalObject: Observable<HalObject>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/hal+json'
    })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
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

  getGroup(groupId: number): Observable<Group> {
    if (environment.backendConnection) {
      this.group = this.http.get<Group>(this.index.groupsUrl + '/' + groupId,
      this.httpOptions).pipe();
      return this.group;
    } else {
      const group = this.administrativeMock.generateGroup('1');
      return of(group);
    }
  }

  getGroupByParameter(pagination: Pagination, parameter: string): Observable<Array<Group>> {
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

      let url = this.index.groupsSearchUrl;

      if (parameter === 'name') {
        url = url + 'searchGroupByName';
      }

      console.log('url: ' + url);
      console.log('params: ' + params);
      console.log('textFilter:' + pagination.textFilter);
      console.log('textField:' + pagination.textField);
      console.log('sortOrder:' + pagination.sortOrder);
      console.log('sortField:' + pagination.sortField);

      return this.http.get<Array<Group>>(url, { params });
    } else {
      return of(this.administrativeMock.generateGroupList());
    }
  }

  getGroupByDonorRequest(request: DonorRequest): Observable<Array<Group>> {
    if (environment.backendConnection) {
      this.groupList = this.http.get<Array<Group>>(this.index.groupsUrl + '/search/searchDonorRequestGroups',
      this.httpOptions).pipe();
      return this.groupList;
    } else {
      const groups = this.administrativeMock.generateGroupList();
      return of(groups);
    }
  }

  listGroups(): Observable<Array<Group>> {
    console.log('Group service - listing groups');
    if (environment.backendConnection) {
      this.groupList = this.http.get<Array<Group>>(this.index.groupsUrl, this.httpOptions).pipe(
              map(data => data[environment.embedded][environment.linksGroups] as Array<Group>)
          );
      console.log('Group service - recovered groups');
      return this.groupList;
    } else {
      const groups = this.administrativeMock.generateGroupList();
      return of(groups);
    }
  }

  listGroupsPagination(pagination: Pagination): Observable<HalObject> {
    console.log('sortOrder: ' + pagination.sortOrder);
    console.log('sortField: ' + pagination.sortField);
    console.log('textFilter: ' + pagination.textFilter);
    console.log('textField: ' + pagination.textField);

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

      this.groupHalObject = this.http.get<HalObject>(this.index.groupsUrl, { params }).pipe(
          map(data => data as HalObject)
      );
      console.log('Group service - recovered hal object groups');
      return this.groupHalObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(environment.linksGroups, this.administrativeMock.generateGroupList());
      return of(halObject);
    }
  }

}
