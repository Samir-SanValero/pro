import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Index, LoginEntity, User } from '../../models/authentication-model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationMockService {
  constructor(private http: HttpClient,
              private router: Router) {
  }

  public getCurrentUser(): User {
    return this.createUserWithData();
  }

  public setCurrentUser(user: User): void {

  }

  public login(loginEntity: LoginEntity): Observable<LoginEntity> {
    return of (new LoginEntity());
  }

  public initializeAuthentication(): any {
    this.loadIndex();
    return of (this.createUserWithData());
  }

  public decodeUser(token: string): User {
    return this.createUserWithData();
  }

  public loadIndex(): void {
  }

  getIndexObservable(): Observable<Index> {
      return of(new Index());
  }

  getUserObservable(): Observable<User> {
      return of(this.createUserWithData());
  }

  private createUserWithData(): User {
      const user: User = new User();
      user.authToken = 'eyJhbGciOiJIUzUxMiJ9.eyJsYXN0TmFtZSI6IkludGVybmFsIiwicm9sZXMiOlsiUk9MRV9JTlRFUk5BTCJdLCJncm91cElkIjoiRS0wMDk4NjMiLCJjb21wYW55TmFtZSI6Ikluc3RpdHV0byBkZSBGZWN1bmRpdGFzIiwiaXNzIjoiY29tLmdlbmVzeXN0ZW1zLmRldiIsImZpcnN0TmFtZSI6IkZlbm9tYXRjaCIsImdyb3VwTmFtZSI6IlJvYmVydG8gQ29jbyIsImNvbXBhbnlJZCI6IjJkMTZlYTBmLTMwNWQtNGNiZC1hNmM4LTNiYjFmZTExOGNlZiIsIm5iZiI6MTYxNTM3MzE2NiwibGFuZ0tleSI6ImVuIiwiaWQiOiJhOTVmMTk1OC0wMTZhLTQwZjgtYTM5Ny04YjM2ODM0NDdiYzgiLCJleHAiOjE2MTUzODAzNjYsImlhdCI6MTYxNTM3MzE2NiwiZW1haWwiOiJmZW5vbWF0Y2hfaW50ZXJuYWxAdGVzdC5jb20iLCJhY3RpdmF0ZWQiOnRydWUsImdyb3VwQ29kZSI6IkUtMDA5ODYzIn0.mHoVrG0s1obsQY0ppTRRNhmZRehdgZ48GGiRMkW0BAwfHo07adeLyZPY7xdkrTVPTdHJaHsb6wI23HW7icb6jw';
      return user;
  }
}


