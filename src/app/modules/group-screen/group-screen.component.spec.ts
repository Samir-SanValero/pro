import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GroupScreenComponent } from './group-screen.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule} from '@angular/material/dialog';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { GroupService } from '../../services/administrative/group.service';
import { Group } from '../../models/administrative-model';
import { TableComponent } from '../common/table/table.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';

describe('GroupScreenComponent', () => {
  let mock: AdministrativeMock;
  let component: GroupScreenComponent;
  let fixture: ComponentFixture<GroupScreenComponent>;
  let service: GroupService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ GroupScreenComponent, TableComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        TranslateService,
        MatDialogModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupScreenComponent);
    component = fixture.componentInstance;

    // We inject the service
    service = TestBed.inject(GroupService);
    mock = TestBed.inject(AdministrativeMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject service', () => {
    expect(service).toBeTruthy();
  });

  it('should call listBanksPagination', () => {
    const halObject = mock.generateHalObject(environment.linksGroups, mock.generateGroupList());

    // We test mock list of objects
    spyOn(service, 'listGroupsPagination').and.callThrough().and.returnValue(of(halObject));

    component.ngOnInit();
    expect(service.listGroupsPagination).toHaveBeenCalled();
  });

  it('showNotification should open message', () => {
    const spy = spyOn(component.notificationMessage, 'openFromComponent');
    component.showNotification('TEST', 'test_class');
    expect(spy).toHaveBeenCalled();
  });

  it('#copyRequestValues should copy name', () => {
    const newGroup: Group = new Group();
    const oldGroup: Group = mock.generateGroup('1');
    component.copyGroupValues(oldGroup, newGroup);
    expect(newGroup.name).toEqual('groupName1');
  });

  it('#backButtonShould stop showing record', () => {
    component.backButton();
    expect(component.showRecord).toEqual(false);
  });

  it('#showRecordGroup should prepare screen for showing record', () => {
    component.showRecordGroup(mock.generateGroup('1'));

    expect(component.groupFormControl.disabled).toEqual(true);
    expect(component.toGroupFormControl.disabled).toEqual(true);
    expect(component.permissionTypeFormControl.disabled).toEqual(true);
  });

  it('#editButton should unlock fields and enable form controls', () => {
    component.permissionTypeFormControl = new FormControl();
    component.toGroupFormControl = new FormControl();
    component.editButton();

    expect(component.unlockFields).toEqual(true);
    expect(component.permissionTypeFormControl.disabled).toEqual(false);
    expect(component.toGroupFormControl.disabled).toEqual(false);
  });

  it('#recordButton should lock fields and disable form controls', () => {
    component.permissionTypeFormControl = new FormControl();
    component.toGroupFormControl = new FormControl();
    component.recordButton();

    expect(component.unlockFields).toEqual(false);
    expect(component.permissionTypeFormControl.disabled).toEqual(true);
    expect(component.toGroupFormControl.disabled).toEqual(true);
  });

  it('#recordButton should lock fields and disable form controls', () => {
    component.permissionTypeFormControl = new FormControl();
    component.toGroupFormControl = new FormControl();
    component.recordButton();

    expect(component.unlockFields).toEqual(false);
    expect(component.permissionTypeFormControl.disabled).toEqual(true);
    expect(component.toGroupFormControl.disabled).toEqual(true);
  });

  it('#addGroupPermission should add GroupPermission', () => {
    const group1 = mock.generateGroup('1');
    const group2 = mock.generateGroup('2');

    component.ngOnInit();
    component.showRecordGroup(group1);

    component.permissionTypeFormControl = new FormControl();
    component.toGroupFormControl = new FormControl();
    component.groupFormControl = new FormControl();

    component.permissionTypeFormControl.patchValue('PRECON_DONOR');
    component.groupFormControl.patchValue(group1.name);
    component.toGroupFormControl.patchValue(group2.name);

    component.addGroupPermission();

    let found = false;

    for (const permission of component.groupPermissions) {
      if (permission.type === 'PRECON_DONOR') {
        found = true;
      }
    }
  });

});
