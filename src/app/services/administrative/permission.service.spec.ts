import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PermissionService } from './permission.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('PermissionServiceTest', () => {
  let service: PermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(PermissionService);
  });

  it('PermissionService should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('#listPermissions should return value', (done: DoneFn) => {
  //   service.listPermissions().subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#createPermission should return value', (done: DoneFn) => {
  //   service.createPermission(1).subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#getGroup should return value', (done: DoneFn) => {
  //   service.updatePermission(1).subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

  // it('#getPermissionByGroupCode should return value', (done: DoneFn) => {
  //   service.getPermissionByGroupCode('1').subscribe(value => {
  //
  //     // Value exists
  //     expect(value).toBeDefined();
  //
  //     done();
  //   });
  // });

});
