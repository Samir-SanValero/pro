import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TableColumn } from '../common/table/table.model';
import { GroupService } from '../../services/administrative/group.service';
import { Group, Permission} from '../../models/administrative-model';
import { NotificationComponent } from '../common/notification/notification.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionService } from '../../services/administrative/permission.service';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Pagination} from '../../models/common-model';
import { TableService } from '../../services/common/table.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../common/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group-screen',
  templateUrl: './group-screen.component.html',
  styleUrls: ['./group-screen.component.scss']
})
export class GroupScreenComponent implements OnInit, OnDestroy {
  defaultPageSizes = environment.groupTableDefaultPageSizes;
  page: number;
  pageSize: number = environment.groupTableDefaultPageSizes[0];
  sortField: string;
  sort: string;
  pagination: Pagination;

  loading: boolean;
  showRecord: boolean;
  unlockFields: boolean;
  editingGroup: Group;
  newPermission: Permission;

  // Subscriptions
  changePageSubscription: Subscription;
  changePageSizeSubscription: Subscription;

  groupSubscription: Subscription;
  groupPermissionSubscription: Subscription;
  permissionSubscription: Subscription;
  addGroupPermissionSubscription: Subscription;
  deleteGroupPermissionSubscription: Subscription;

  // Objects
  groups: Group[];
  groupsUnsorted: Group[];

  groupPermissions: Permission[];
  groupPermissionsUnsorted: Permission[];

  permissions: Permission[];
  permissionTypes: string[];

  tableColumns: Array<TableColumn>;
  permissionTableColumns: Array<TableColumn>;

  permissionTypeFormControl: FormControl;
  permissionTypeFiltered: Observable<Permission[]>;

  groupFormControl: FormControl;
  groupsFiltered: Observable<Group[]>;

  toGroupFormControl: FormControl;
  toGroupsFiltered: Observable<Group[]>;

  groupsFilterEvent: any;

  dialogResult: boolean;
  searchFields: Array<string>;

  constructor(
    public groupService: GroupService,
    public permissionService: PermissionService,
    public dialog: MatDialog,
    public notificationMessage: MatSnackBar,
    public tableService: TableService,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.currentPagSize = this.pageSize;
    this.loading = true;
    this.tableColumns = new Array<TableColumn>();

    const tableColumnCode: TableColumn = {
      name: 'group-screen.code-column',
      dataKey: 'id',
      position: 'left',
      isSortable: true
    };

    const tableColumnName: TableColumn = {
      name: 'group-screen.name-column',
      dataKey: 'name',
      position: 'left',
      isSortable: true
    };

    const tableColumnCompanyCode: TableColumn = {
      name: 'group-screen.company-code-column',
      dataKey: 'companyCode',
      position: 'left',
      isSortable: true
    };

    const tableColumnCompanyName: TableColumn = {
      name: 'group-screen.company-name-column',
      dataKey: 'companyName',
      position: 'left',
      isSortable: true
    };

    const tableColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.tableColumns.push(tableColumnCode);
    this.tableColumns.push(tableColumnName);
    this.tableColumns.push(tableColumnCompanyCode);
    this.tableColumns.push(tableColumnCompanyName);
    this.tableColumns.push(tableColumnActions);

    this.tableService.selectPageSize(this.pageSize);
    this.searchFields = new Array<string>();
    this.searchFields.push('group-screen.search-fields.group-name');

    this.processListGroups();
  }

  ngOnDestroy(): void {
    if (this.changePageSubscription !== undefined) {
      this.changePageSubscription.unsubscribe();
    }

    if (this.changePageSizeSubscription !== undefined) {
      this.changePageSizeSubscription.unsubscribe();
    }

    if (this.groupSubscription !== undefined) {
      this.groupSubscription.unsubscribe();
    }

    if (this.groupPermissionSubscription !== undefined) {
      this.groupPermissionSubscription.unsubscribe();
    }

    if (this.permissionSubscription !== undefined) {
      this.permissionSubscription.unsubscribe();
    }

    if (this.addGroupPermissionSubscription !== undefined) {
      this.addGroupPermissionSubscription.unsubscribe();
    }

    if (this.deleteGroupPermissionSubscription !== undefined) {
      this.deleteGroupPermissionSubscription.unsubscribe();
    }
  }

  processListGroups(): void {
    if (this.pagination.textFilter === null || this.pagination.textFilter === '') {
      const obs = this.groupService.listGroupsPagination(this.pagination);
      if (obs !== null && obs !== undefined) {
        this.groupSubscription = obs.subscribe((groupData) => {
          if (groupData._embedded !== undefined) {
            this.groups = groupData._embedded[environment.linksGroups] as Array<Group>;
            this.groupsUnsorted = groupData._embedded[environment.linksGroups] as Array<Group>;
            console.log('Group screen - recovered groups');
            const groupList = new Array<Group>();
            for (const group of this.groups) {
              groupList.push(Group.fromObject(group));
            }
            this.groups = groupList;
            this.loading = false;
            if (groupData.page !== undefined) {
              this.pagination.currentPag = groupData.page.number;
              this.pagination.numberOfPages = groupData.page.totalPages;
              this.pagination.totalElements = groupData.page.totalElements;
            }
          }
        });
      }
    } else {
      if (this.pagination.textField.toLowerCase()
        === this.translateService.instant('group-screen.search-fields.group-name').toLowerCase() ||
        this.pagination.textField === undefined || this.pagination.textField === '') {

        if (this.groupSubscription !== undefined) {
          this.groupSubscription.unsubscribe();
        }

        this.groupSubscription = this.groupService.getGroupByParameter(this.pagination, 'name').subscribe(response => {
          console.log(response);
          const group = response as Array<Group>;

          this.pagination.totalElements = 1;
          const mutAux: Array<Group> = new Array<Group>();

          mutAux.push(Group.fromObject(group));

          this.groups = mutAux;
          this.loading = false;
        }, error => {
          this.pagination.totalElements = 0;
          this.groups = [];
        });
      }
    }
  }

  showRecordGroup(group: Group): void {
    console.log('group.id: ' + group.id);
    console.log('group.name: ' + group.name);
    console.log('group.companyName: ' + group.companyName);
    console.log('group.companyCode: ' + group.companyCode);

    // LOAD GROUP PERMISSIONS
    this.permissionSubscription = this.permissionService.listPermissions().subscribe((permissionData) => {
      console.log('Loading all permissions');
      this.permissions = permissionData as Permission[];

      for (let permissionObject of this.permissions) {
        permissionObject = this.obtainPermissionId(permissionObject);
      }

      this.groupPermissionSubscription = this.permissionService.getPermissionByGroupCode(group).subscribe(
        (groupPermissionData) => {
          console.log('Loading group permissions');

          this.groupPermissions = groupPermissionData as Array<Permission>;

          const permissionList = new Array<Permission>();
          let permissionElement = new Permission();

          for (let permission of this.groupPermissions) {
            permission = this.obtainPermissionId(permission);
            permissionElement = permissionElement.fromObject(permission);
            permissionElement.groupName = group.name;
            permissionList.push(permissionElement);
          }

          this.groupPermissions = permissionList;
          this.groupPermissionsUnsorted = permissionList;

        },
        error => {
          console.log('Error caught: ' + error);
          this.groupPermissions = new Array<Permission>();
          this.groupPermissionsUnsorted = new Array<Permission>();
        }).add(() => {
          console.log('Add caught');
          console.log('Editing group: ' + group.id);

          this.editingGroup = new Group();
          this.copyGroupValues(group, this.editingGroup);

          this.newPermission = new Permission();
          this.newPermission.groupCode = this.editingGroup.id;

          this.permissionTypes = [
            this.newPermission.typeDonor,
            this.newPermission.typeMatch,
            this.newPermission.typeKit,
            this.newPermission.typeExternalRequest,
            this.newPermission.typeRequestsBlocked,
            this.newPermission.typeBankLink
          ];

          this.showRecord = true;

          // this.unlockFields = false;
          this.permissionTableColumns = new Array<TableColumn>();

          const tableColumnType: TableColumn = {
            name: 'group-screen.permission-type-column',
            dataKey: 'permissionType',
            position: 'left',
            isSortable: true
          };

          const tableColumnToGroup: TableColumn = {
            name: 'group-screen.permission-to-group-column',
            dataKey: 'permissionToGroup',
            position: 'left',
            isSortable: true
          };

          const tableColumnPermissionActions: TableColumn = {
            name: 'Actions',
            dataKey: 'actions',
            position: 'right',
            isSortable: false
          };

          this.permissionTableColumns.push(tableColumnType);
          this.permissionTableColumns.push(tableColumnToGroup);
          this.permissionTableColumns.push(tableColumnPermissionActions);

          this.permissionTypeFormControl = new FormControl();
          this.groupFormControl = new FormControl();
          this.toGroupFormControl = new FormControl();

          if (!this.unlockFields) {
            this.groupFormControl.disable();
            this.toGroupFormControl.disable();
            this.permissionTypeFormControl.disable();
          }

          this.groupsFiltered = this.groupFormControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.type),
                map(type => type ? this.filterGroups(type) : this.groups.slice())
            );

          this.toGroupsFiltered = this.toGroupFormControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.type),
                map(type => type ? this.filterGroups(type) : this.groups.slice())
            );
        }
      );
    });
  }

  editButton(): void {
    this.unlockFields = true;

    this.permissionTypeFormControl.enable();
    this.toGroupFormControl.enable();
  }

  recordButton(): void {
    this.unlockFields = false;

    this.permissionTypeFormControl.disable();
    this.toGroupFormControl.disable();
  }

  backButton(): void {
    // MAINTAIN RECENT COLUMN ORDER
    if (this.groupsFilterEvent !== undefined && this.groupsFilterEvent !== null) {
      console.log('Refiltering groups with: ' + this.groupsFilterEvent);
      this.sortGroups(this.groupsFilterEvent);
    }

    // this.loadData();
    this.unlockFields = false;
    this.showRecord = false;
  }

  saveModelChanges(updatedGroup: Group): void {
    for (const group of this.groups) {
      console.log('Comparing groups: ' + group.id + ' with ' + updatedGroup.id);
      if (updatedGroup.id === group.id) {
        this.copyGroupValues(updatedGroup, group);
        break;
      }
    }

    this.showNotification('common-elements.messages.data-saved', 'notification-class');
  }

  copyGroupValues(copyFromGroup: Group, toGroup: Group): void {
    toGroup.id = copyFromGroup.id;
    toGroup.name = copyFromGroup.name;
    toGroup.externalCode = copyFromGroup.externalCode;
    toGroup.companyCode = copyFromGroup.companyCode;
    toGroup.companyName = copyFromGroup.companyName;
  }

  showNotification(message: string, panelClass: string): void {
    this.notificationMessage.openFromComponent(NotificationComponent, {
      data: message,
      panelClass: ['mat-toolbar', 'mat-primary'],
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  deleteGroupPermission(permission: Permission): void {
    console.log('Group screen component - deleting group permission: ');
    console.log('id: ' + permission.id);
    console.log('groupCode: ' + permission.groupCode);
    console.log('type: ' + permission.type);
    console.log('toGroupCode: ' + permission.toGroupCode);

    const dialogData = new ConfirmDialogModel(
        'group-screen.messages.permission-deletion-confirmation-title',
        'group-screen.messages.permission-deletion-confirmation',
        'common-elements.messages.confirmation-dialog-accept',
        'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogResult = dialogResult as boolean;
      if (this.dialogResult) {
        for (const groupPermission of this.groupPermissions) {
          if (groupPermission.groupCode === permission.groupCode &&
              groupPermission.type === permission.type &&
              groupPermission.toGroupCode === permission.toGroupCode) {
            console.log('id: ' + groupPermission.id);
            console.log('groupCode: ' + groupPermission.groupCode);
            console.log('type: ' + groupPermission.type);
            console.log('toGroupCode: ' + groupPermission.toGroupCode);
            try {
              this.deleteGroupPermissionSubscription = this.permissionService.deletePermission(permission).subscribe(
                  (deletedPermissionData) => {
                    this.groupPermissions = this.groupPermissions.filter(
                        permissionFiltered => (
                            groupPermission.id !== permissionFiltered.id ||
                            groupPermission.groupCode !== permissionFiltered.groupCode ||
                            groupPermission.type !== permissionFiltered.type ||
                            groupPermission.toGroupCode !== permissionFiltered.toGroupCode
                        )
                    );

                    this.showNotification('group-screen.messages.permission-deleted', 'notification-class');
                  },
                  error => {
                    console.log('Error caught: ' + error);
                    this.showNotification('group-screen.messages.permission-not-saved', 'notification-class-warn');
                  }
              );
            } catch (e) {
              console.log('');
              this.showNotification('group-screen.messages.permission-not-saved', 'notification-class-warn');
            }
          }
        }
      }
    });
  }

  addGroupPermission(): void {
    if (this.permissionTypeFormControl !== undefined && this.toGroupFormControl !== null) {
      this.newPermission.type = this.permissionTypeFormControl.value;
    }

    if (this.toGroupFormControl !== undefined && this.toGroupFormControl !== null) {
      if (this.toGroupFormControl.value !== undefined && this.toGroupFormControl.value !== null) {
        this.newPermission.toGroupCode = this.toGroupFormControl.value.id;
      }
    }

    console.log('Group screen component - adding permission');
    console.log('ID: ' + this.newPermission.id);
    console.log('GroupCode: ' + this.newPermission.groupCode);
    console.log('Type: ' + this.newPermission.type);
    console.log('ToGroupCode: ' + this.newPermission.toGroupCode);

    // SEARCH IF ITS ALREADY ADDED
    let alreadyAdded = false;

    for (const groupPermission of this.groupPermissions) {
      if (groupPermission.groupCode === this.newPermission.groupCode &&
        groupPermission.type === this.newPermission.type &&
        groupPermission.toGroupCode === this.newPermission.toGroupCode) {
        console.log('Group permission is already added');
        alreadyAdded = true;
      }
    }

    if (!alreadyAdded) {
      try {
        this.addGroupPermissionSubscription = this.permissionService.createPermission(this.newPermission).subscribe(
            (createdPermissionData) => {
              this.newPermission = createdPermissionData as Permission;

              this.groupPermissions.push(this.newPermission);
              this.groupPermissionsUnsorted.push(this.newPermission);
              this.permissionService.selectGroupPermissions(this.groupPermissions);

              this.showRecordGroup(this.editingGroup);

              this.showNotification('group-screen.messages.permission-added', 'notification-class');
            },
            error => {
              console.log('Error caught: ' + error);
              this.showNotification('group-screen.messages.permission-not-saved', 'notification-class-warn');
            }
        );
      } catch (e) {
        console.log('');
        this.showNotification('group-screen.messages.permission-not-saved', 'notification-class-warn');
      }
    } else {
      this.showNotification('group-screen.messages.permission-already-exists', 'notification-class');
    }


  }

  filterPermissionTypes(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.permissionTypes.filter(type => type.toLowerCase().indexOf(filterValue) === 0);
  }

  displayPermissionType(permission: Permission): string {
    if (permission !== undefined && permission !== null) {
      return permission.type;
    }
  }

  filterGroups(name: string): Group[] {
    console.log('Filtering groups: ' + name);

    const filterValue = name.toLowerCase();
    return this.groups.filter(group => group.name.toLowerCase().indexOf(filterValue) === 0);
  }

  displayGroupInPermissionList(group: Group): string {
    return group && group.name ? group.name : '';
  }

  obtainPermissionId(permission: Permission): Permission {
    const permissionCopy = new Permission();

    try {
      const permissionLinkId = permission._links[environment.self][environment.href];

      permissionCopy.id = permissionLinkId.substring(permissionLinkId.lastIndexOf('/') + 1, permissionLinkId.length);
      permissionCopy.groupCode = permission.groupCode;
      permissionCopy.type = permission.type;
      permissionCopy.toGroupCode = permission.toGroupCode;

      return permissionCopy;
    } catch (e) {
      return permission;
    }
  }

  sortGroups(event: any): void {
    this.pagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
      this.pagination.sortField = event.active;
      this.pagination.sortOrder = event.direction;
    }
    this.processListGroups();
  }

  pageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.totalElements = event.length;
      this.pagination.currentPag = event.pageIndex;
      this.pagination.currentPagSize = event.pageSize;
    }
    this.processListGroups();
  }

  textFiltered(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.textFilter = event.target.value;
      this.pagination.currentPag = 0;
      this.pagination.textField = event.field;
    }
    this.processListGroups();
  }

}
