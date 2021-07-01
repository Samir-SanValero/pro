import { Injectable } from '@angular/core';
import { Group, Permission, Request } from '../../models/administrative-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Index } from '../../models/authentication-model';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AdministrativeMock } from './administrative.mock';

@Injectable({ providedIn: 'root' })
export class PermissionService {

  index: Index;
  indexSubscription: Subscription;

  permissionSubject: BehaviorSubject<Permission> = new BehaviorSubject<Permission>(new Permission());
  permission: Observable<Group>;

  permissionListSubject: BehaviorSubject<Array<Permission>> = new BehaviorSubject<Array<Permission>>(new Array<Permission>());
  permissionList: Observable<Array<Permission>>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              private administrativeMock: AdministrativeMock) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      this.index = indexData as Index;
    });
  }

  listPermissions(): Observable<Array<Permission>> {
    console.log('Permission service - listing permissions');
    if (environment.backendConnection) {
      this.permissionList = this.http.get<Array<Permission>>(this.index.permissionUrl, this.httpOptions).pipe(
            map(data => data[environment.embedded][environment.linksPermissions] as Array<Permission>
          )
      );
      console.log('Permission service - recovered permissions');
      return this.permissionList;
    } else {
      const permissions = this.administrativeMock.generatePermissionList();
      return of(permissions);
    }
  }

  createPermission(permission: Permission): Observable<Permission> {
    console.log('Permission service - creating permission');
    if (environment.backendConnection) {
      return this.http.post<Permission>(this.index.permissionUrl, permission, this.httpOptions).pipe(
          map(data => data as Permission)
      );
    } else {
      permission.id = '1';
      return of(permission);
    }
  }

  updatePermission(permission: Permission): void {
    if (environment.backendConnection) {
      this.http.put<Request>(this.index.permissionUrl, JSON.stringify(permission), this.httpOptions).pipe(retry(1),
          catchError(this.errorHandle));
    } else {

    }
  }

  deletePermission(permission: Permission): Observable<any> {
    console.log('Permission service - creating permission');

    if (environment.backendConnection) {
      return this.http.delete<any>(this.index.permissionUrl + '/' + permission.id, this.httpOptions).pipe(
          map(data => data as Permission)
      );
    } else {
      return of('');
    }
  }

  getPermissionByGroupCode(group: Group): Observable<Array<Permission>> {
    console.log('Permission service - listing permissions');
    if (environment.backendConnection) {
        this.permissionList = this.http.get<Array<Permission>>(this.index.permissionUrl +
                                                                '/search/findByGroupCode?groupCode=' + group.id, this.httpOptions)
          .pipe(
            map(data => data[environment.embedded][environment.linksPermissions] as Array<Permission>),
            catchError(this.errorHandle)
          );
        console.log('Permission service - recovered permissions of group: ' + group.id);
        return this.permissionList;
    } else {
      const permissions = this.administrativeMock.generatePermissionList();
      return of(permissions);
    }
  }

  errorHandle(error): Observable<never> {
    console.log('Error handler: ' + error);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  selectGroupPermissions(permissions: Array<Permission>): Observable<Array<Permission>> {
    this.permissionListSubject.next(permissions);
    return this.permissionListSubject.asObservable();
  }

}
