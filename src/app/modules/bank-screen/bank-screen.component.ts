import { Component, OnDestroy, OnInit } from '@angular/core';
import { Bank, Group, Request } from '../../models/administrative-model';
import { Observable, Subscription } from 'rxjs';
import { BankService } from '../../services/administrative/bank.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../common/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../common/table/table.model';
import { NotificationComponent } from '../common/notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TableService } from '../../services/common/table.service';
import { HalObject, Pagination } from '../../models/common-model';
import { GroupService } from '../../services/administrative/group.service';
import { RequestService } from '../../services/administrative/request.service';
import { ErrorService } from '../../services/common/error.service';
import { BackendError } from '../../models/error-model';

@Component({
  selector: 'app-bank-screen',
  templateUrl: './bank-screen.component.html',
  styleUrls: ['./bank-screen.component.scss']
})
export class BankScreenComponent implements OnInit, OnDestroy {
  defaultPageSizes = environment.bankTableDefaultPageSizes;
  page: number;
  pageSize: number = environment.bankTableDefaultPageSizes[0];
  sortField: string;
  sort: string;
  pagination: Pagination;
  allRequestsPagination: Pagination;
  bankRequestsPagination: Pagination;

  loading: boolean;
  creating: boolean;
  showRecord: boolean;
  unlockFields: boolean;
  public adding: boolean;
  editingBank: Bank;

  public dataSource: any;
  public currentPageSize = 5;

  public showDeleteDialog: boolean;
  public dialogResult: boolean;

  public banks: Array<Bank>;
  public banksUnsorted: Array<Bank>;

  public selectedBank: Bank;

  tableColumns: Array<TableColumn>;
  requestsTableColumns: Array<TableColumn>;

  changePageSubscription: Subscription;
  changePageSizeSubscription: Subscription;

  changePageAllRequestsSubscription: Subscription;
  changePageAllRequestsSizeSubscription: Subscription;

  changePageBankRequestsSubscription: Subscription;
  changePageBankRequestsSizeSubscription: Subscription;

  banksSubscription: Subscription;
  groupsSubscription: Subscription;
  addBankSubscription: Subscription;
  deleteBankSubscription: Subscription;
  dialogSubscription: Subscription;
  allRequestsSubscription: Subscription;
  bankRequestsSubscription: Subscription;
  removeRequestSubscription: Subscription;

  groupFormControl: FormControl;
  groupsFiltered: Observable<Group[]>;
  groups: Group[];
  searchFields: Array<string>;
  allRequestSearchFields: Array<string>;

  allRequests: Array<Request>;
  bankRequests: Array<Request>;

  constructor(
    public bankService: BankService,
    public groupService: GroupService,
    public dialog: MatDialog,
    public notificationMessage: MatSnackBar,
    public translateService: TranslateService,
    public tableService: TableService,
    public requestService: RequestService,
    public errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.currentPagSize = this.pageSize;

    this.allRequestsPagination = new Pagination();
    this.allRequestsPagination.currentPagSize = this.pageSize;

    this.bankRequestsPagination = new Pagination();
    this.bankRequestsPagination.currentPagSize = this.pageSize;

    this.showDeleteDialog = false;
    this.showRecord = false;
    this.adding = false;
    this.loading = true;
    this.tableColumns = new Array<TableColumn>();

    const tableColumnActive: TableColumn = {
      name: 'bank-screen.status-column',
      dataKey: 'active',
      position: 'left',
      isSortable: true,
      showBooleanIcon: true
    };

    const tableColumnCode: TableColumn = {
      name: 'bank-screen.code-column',
      dataKey: 'code',
      position: 'left',
      isSortable: true
    };

    const tableColumnName: TableColumn = {
      name: 'bank-screen.name-column',
      dataKey: 'name',
      position: 'left',
      isSortable: true
    };

    const tableColumnGroupCode: TableColumn = {
      name: 'bank-screen.group-code-column',
      dataKey: 'groupCode',
      position: 'left',
      isSortable: true
    };

    const tableColumnGroupName: TableColumn = {
      name: 'bank-screen.group-name-column',
      dataKey: 'groupName',
      position: 'left',
      isSortable: true
    };

    const tableColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.tableColumns.push(tableColumnActive);
    this.tableColumns.push(tableColumnCode);
    this.tableColumns.push(tableColumnName);
    this.tableColumns.push(tableColumnGroupCode);
    this.tableColumns.push(tableColumnGroupName);
    this.tableColumns.push(tableColumnActions);

    this.tableService.selectPageSize(this.pageSize);
    this.searchFields = new Array<string>();

    this.searchFields.push('bank-screen.search-fields.bank-name');
    this.searchFields.push('bank-screen.search-fields.bank-code');
    this.searchFields.push('bank-screen.search-fields.bank-group-name');

    this.allRequestSearchFields = new Array<string>();
    this.allRequestSearchFields.push(this.translateService.instant('request-screen.search-fields.request-first-name'));
    this.allRequestSearchFields.push(this.translateService.instant('request-screen.search-fields.request-last-name'));
    this.allRequestSearchFields.push(this.translateService.instant('request-screen.search-fields.request-ur-code'));
    this.allRequestSearchFields.push(this.translateService.instant('request-screen.search-fields.request-ext-code'));

    const pagination = new Pagination();
    pagination.currentPagSize = 500;
    this.groupsSubscription = this.groupService.listGroupsPagination(pagination).subscribe(response => {
      const halObject = response as HalObject;
      this.groups = halObject._embedded[environment.linksGroups] as Array<Group>;
    });
    this.processListBanks();
  }

  ngOnDestroy(): void {
    if (this.changePageSubscription !== undefined) {
      this.changePageSubscription.unsubscribe();
    }

    if (this.changePageSizeSubscription !== undefined) {
      this.changePageSizeSubscription.unsubscribe();
    }

    if (this.banksSubscription !== undefined) {
      this.banksSubscription.unsubscribe();
    }

    if (this.groupsSubscription !== undefined) {
      this.groupsSubscription.unsubscribe();
    }

    if (this.addBankSubscription !== undefined) {
      this.addBankSubscription.unsubscribe();
    }

    if (this.deleteBankSubscription !== undefined) {
      this.deleteBankSubscription.unsubscribe();
    }

    if (this.dialogSubscription !== undefined) {
      this.dialogSubscription.unsubscribe();
    }

    if (this.allRequestsSubscription !== undefined) {
      this.allRequestsSubscription.unsubscribe();
    }

    if (this.bankRequestsSubscription !== undefined) {
      this.bankRequestsSubscription.unsubscribe();
    }

    if (this.removeRequestSubscription !== undefined) {
      this.removeRequestSubscription.unsubscribe();
    }
  }

  processListBanks(): void {
    const timeout = setTimeout(() => {
      this.tableService.selectLoadingSearch(true);
    }, 1000);

    if (this.pagination.textFilter === null || this.pagination.textFilter === '') {
      const bankArray: Array<Bank> = new Array<Bank>();
      const obs = this.bankService.listBanksPagination(this.pagination);
      if (obs !== null && obs !== undefined) {
        if (this.banksSubscription !== undefined) {
          this.banksSubscription.unsubscribe();
        }
        this.banksSubscription = obs.subscribe(
          response => {
            if (response._embedded !== undefined) {
              response._embedded[environment.linksBanks].forEach(element => {
                const bank: Bank = Bank.fromObject(element);
                bankArray.push(bank);
              });
              this.banks = bankArray;
              this.loading = false;
              this.assignGroupNames();
              clearTimeout(timeout);
              this.tableService.selectLoadingSearch(false);
            }
            if (response.page !== undefined) {
              this.pagination.currentPag = response.page.number;
              this.pagination.numberOfPages = response.page.totalPages;
              this.pagination.totalElements = response.page.totalElements;
            }
          },
          error => {
            console.log(error);
          });
      }
    } else {

      let parameter: string;

      if (this.pagination.textField.toLowerCase() === this.translateService.instant('bank-screen.search-fields.bank-name').toLowerCase()) {
        parameter = 'name';
      } else if (this.pagination.textField.toLowerCase()
        === this.translateService.instant('bank-screen.search-fields.bank-code').toLowerCase()) {
        parameter = 'code';
      } else if (this.pagination.textField.toLowerCase()
        === this.translateService.instant('bank-screen.search-fields.bank-group-name').toLowerCase() ) {
        parameter = 'groupName';
      }

      if (this.banksSubscription !== undefined) {
        this.banksSubscription.unsubscribe();
      }

      this.banksSubscription = this.bankService.getBankByParameter(this.pagination, parameter).subscribe(data => {
        const bankAux: Array<Bank> = new Array<Bank>();
        if (data._embedded !== null
          && data._embedded !== undefined
          && data._embedded[environment.linksBanks] !== null
          && data._embedded[environment.linksBanks] !== undefined) {
          data._embedded[environment.linksBanks].forEach(element => {
            bankAux.push(Bank.fromObject(element));
          });
        }
        if (data.page !== undefined) {
          this.pagination.currentPag = data.page.number;
          this.pagination.numberOfPages = data.page.totalPages;
          this.pagination.totalElements = data.page.totalElements;
        }
        this.banks = bankAux;
        this.loading = false;
        this.assignGroupNames();
        clearTimeout(timeout);
        this.tableService.selectLoadingSearch(false);
      });
    }
  }

  addBank(): void {
    console.log('Bank screen component - addBank');

    this.creating = true;
    this.unlockFields = true;
    this.editingBank = new Bank();
    this.editingBank.active = true;

    this.groupFormControl = new FormControl();

    this.groupsFiltered = this.groupFormControl.valueChanges
        .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.type),
            map(type => type ? this.filterGroups(type) : this.groups.slice())
        );

    this.showRecord = true;
    this.adding = true;
  }

  editBank(editBank: Bank): void {
    console.log('Editing bank: ' + editBank.code);
    console.log(editBank._links);

    let foundBank: Bank;
    for (const bank of this.banks) {
      if (bank.name === editBank.name) {
        console.log('Found bank');
        foundBank = bank;
      }
    }

    this.editingBank = new Bank();
    this.groupFormControl = new FormControl();
    this.groupFormControl.disable();

    this.groupsFiltered = this.groupFormControl.valueChanges
        .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.type),
            map(type => type ? this.filterGroups(type) : this.groups.slice())
        );

    for (const group of this.groups) {
      if (group.id === foundBank.groupCode) {
        console.log('Found group inside bank');
        console.log('Group externalcode: ' + group.externalCode);
        console.log('Bank groupCode: ' + foundBank.groupCode);
        this.groupFormControl.patchValue(group);
      }
    }

    this.copyRequestValues(foundBank, this.editingBank);
    this.showRecord = true;

    this.processListRequests();
    this.processBankRequests();
    this.loadRequestColumns();
  }

  deleteBank(deletingBank: Bank): void {
    const dialogData = new ConfirmDialogModel(
              'bank-screen.messages.bank-confirmation-title',
           'bank-screen.messages.bank-deleting-question',
    'common-elements.messages.confirmation-dialog-accept',
    'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogResult = dialogResult as boolean;
      if (this.dialogResult) {
        console.log('Confirmed bank deletion');
        console.log('Bank screen component - deleting bank: ');

        for (const bank of this.banks) {
          if (bank.code === deletingBank.code) {
            try {
              this.deleteBankSubscription = this.bankService.deleteBank(bank).subscribe(
                  (deletedBankData) => {
                    this.banks = this.banks.filter(
                        bankFiltered => (
                          bank._links.self !== bankFiltered._links.self
                        )
                    );
                    this.showNotification('bank-screen.messages.bank-deleted', 'notification-class');
                  },
                  error => {
                    console.log('Error caught: ' + error.error.message);
                    this.showNotification(error.error.message, 'notification-class-warn');
                  }
              );
            } catch (e) {
              console.log('');
              this.showNotification('bank-screen.messages.bank-not-saved', 'notification-class-warn');
            }
          }
        }

      } else {
        console.log('Canceled bank deletion');
      }
    },
    error => {
      this.showNotification(error, 'notification-class');
    });
  }

  sortBanks(event: any): void {
    this.pagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
      this.pagination.sortField = event.active;
      this.pagination.sortOrder = event.direction;
    }
    this.processListBanks();
  }

  editButton(): void {
    this.unlockFields = true;
    this.groupFormControl.enable();
  }

  recordButton(): void {
    this.unlockFields = false;
    this.groupFormControl.disable();
  }

  backButton(): void {
    this.showRecord = false;
    this.adding = false;
    this.creating = false;
  }

  saveBank(updatedBank: Bank): void {
    console.log('Bank screen - saving bank changes');

    try {
     if (this.adding) {
       console.log('Bank screen - This bank is NEW');
       if (this.groupFormControl.value !== undefined && this.groupFormControl.value !== null) {
         for (const group of this.groups) {
           if (group.id === this.groupFormControl.value.id) {
             updatedBank.groupCode = this.groupFormControl.value.id;
           }
         }
       }

       this.addBankSubscription = this.bankService.createBank(updatedBank).subscribe(
           (createdBank) => {
             this.editingBank = createdBank as Bank;
             this.showNotification('bank-screen.messages.bank-added', 'notification-class');

             const bankElement = new Bank();
             this.editingBank = Bank.fromObject(this.editingBank);
             this.banks.push(this.editingBank);
           },
           error => {
             console.log('Error caught: ' + error.message);
             this.showNotification(this.errorService.readError(error.error as BackendError), 'notification-class-warn');
           }
       );
     } else if (this.showRecord) {
       console.log('Bank screen - This bank is EDITED');
       if (this.groupFormControl.value !== undefined && this.groupFormControl.value !== null) {
         for (const group of this.groups) {
           if (group.id === this.groupFormControl.value.id) {
             updatedBank.groupCode = this.groupFormControl.value.id;
           }
         }
       }

       this.addBankSubscription = this.bankService.updateBank(updatedBank).subscribe(
           (createdBank) => {
             this.editingBank = createdBank as Bank;
             this.showNotification('bank-screen.messages.bank-updated', 'notification-class');

             const bankElement = new Bank();
             this.editingBank = Bank.fromObject(this.editingBank);
           },
           error => {
             console.log('Error caught: ' + error.error.message);
             this.showNotification(this.errorService.readError(error.error as BackendError), 'notification-class-warn');
           }
       );
     } else {
       console.log('Bank screen - This bank is is being activated or deactivated');
       this.addBankSubscription = this.bankService.updateBank(updatedBank).subscribe(
           (createdBank) => {
             this.editingBank = createdBank as Bank;
             if (updatedBank.active) {
               this.showNotification('bank-screen.messages.bank-updated', 'notification-class');
             } else {
               this.showNotification('bank-screen.messages.bank-updated', 'notification-class');
             }
           },
           error => {
             console.log('Error caught: ' + error.error.message);
             this.showNotification(this.errorService.readError(error.error as BackendError), 'notification-class-warn');
           }
       );
     }

    } catch (e) {
      console.log(e);
      this.showNotification('bank-screen.messages.bank-not-saved', 'notification-class-warn');
    }
  }

  toggleTableField(event: any): void {
    const dialogData = new ConfirmDialogModel(
        'bank-screen.messages.bank-confirmation-title',
        'bank-screen.messages.bank-modification-confirmation',
        'common-elements.messages.confirmation-dialog-accept',
        'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogResult = dialogResult as boolean;
      if (this.dialogResult) {

        console.log(event[0]);
        console.log(event[1] as Bank);

        const columnName = event[0] as string;
        const toggledBank = event[1] as Bank;

        if (columnName === 'active') {
          for (const bank of this.banks) {
            if (toggledBank.code === bank.code) {
              console.log('Found bank to toggle in bank list');
              bank.active = !bank.active;
              this.saveBank(bank);
            }
          }
        }
      } else {
        console.log('Canceled bank deletion');
      }
    });
  }

  copyRequestValues(copyFromBank: Bank, toBank: Bank): void {
    toBank.groupCode = copyFromBank.groupCode;
    toBank.code = copyFromBank.code;
    toBank.name = copyFromBank.name;
    toBank.description = copyFromBank.description;
    toBank.active = copyFromBank.active;
    toBank.containsExternalRequests = copyFromBank.containsExternalRequests;

    toBank.requests = copyFromBank.requests;
    toBank.matchableRequestsForRequest = copyFromBank.matchableRequestsForRequest;
    toBank._links = copyFromBank._links;
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

  filterGroups(name: string): Group[] {
    console.log('Filtering groups: ' + name);

    const filterValue = name.toLowerCase();
    return this.groups.filter(group => group.name.toLowerCase().indexOf(filterValue) === 0);
  }

  displayGroup(group: Group): string {
    return group && group.name ? group.name : '';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.totalElements = event.length;
      this.pagination.currentPag = event.pageIndex;
      this.pagination.currentPagSize = event.pageSize;
    }
    this.processListBanks();
  }

  allRequestsPageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.allRequestsPagination.totalElements = event.length;
      this.allRequestsPagination.currentPag = event.pageIndex;
      this.allRequestsPagination.currentPagSize = event.pageSize;
    }
    this.processListRequests();
  }

  bankRequestsPageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.bankRequestsPagination.totalElements = event.length;
      this.bankRequestsPagination.currentPag = event.pageIndex;
      this.bankRequestsPagination.currentPagSize = event.pageSize;
    }
    this.processBankRequests();
  }

  textFiltered(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.textFilter = event.target.value;
      this.pagination.currentPag = 0;
      this.pagination.textField = event.field;
    }
    this.processListBanks();
  }

  textFilteredAllRequests(event): void {
    if (event !== null && event !== undefined) {
      this.allRequestsPagination.textFilter = event.target.value;
      this.allRequestsPagination.currentPag = 0;
      this.allRequestsPagination.textField = event.field;
    }
    this.processListRequests();
  }

  assignGroupNames(): void {
    for (const bank of this.banks) {
      for (const group of this.groups) {
        if (bank.groupCode === group.id) {
          bank.groupName = group.name;
        }
      }
    }
  }

  addRequestFromBank(addingRequest: Request): void {
    this.allRequests = this.allRequests.filter(
      bankRequestFilter => (
        addingRequest._links.self !== bankRequestFilter._links.self
      )
    );

    // this.bankService.addRequestsToBank(this.editingBank, addingRequest);
    this.showNotification('bank-screen.messages.bank-request-added', 'notification-class-warn');
  }

  removeRequestFromBank(deletingRequest: Request): void {
    const dialogData = new ConfirmDialogModel(
      'bank-screen.messages.bank-request-confirmation-title',
      'bank-screen.messages.bank-request-deletion-confirmation',
      'common-elements.messages.confirmation-dialog-accept',
      'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
        this.dialogResult = dialogResult as boolean;
        if (this.dialogResult) {
          console.log('Confirmed bank deletion');
          console.log('Bank screen component - deleting request from bank: ');

          for (const request of this.bankRequests) {
            if (request._links.self.href === deletingRequest._links.self.href) {
              try {
                this.removeRequestSubscription = this.bankService.removeRequestFromBank(this.editingBank, request).subscribe(
                  () => {
                    this.bankRequests = this.bankRequests.filter(
                      bankRequestFilter => (
                        request._links.self !== bankRequestFilter._links.self
                      )
                    );
                    this.showNotification('bank-screen.messages.bank-request-deleted', 'notification-class');
                  },
                  error => {
                    console.log('Error caught: ' + error);
                    this.showNotification('bank-screen.messages.bank-request-not-deleted', 'notification-class-warn');
                  }
                );
              } catch (e) {
                console.log('');
                this.showNotification('bank-screen.messages.bank-request-not-deleted', 'notification-class-warn');
              }
            }
          }

        } else {
          console.log('Canceled bank deletion');
        }
      },
      error => {
        this.showNotification(error, 'notification-class');
      });
  }

  loadRequestColumns(): void {

    this.requestsTableColumns = new Array<TableColumn>();

    const tableColumnUrCode: TableColumn = {
      name: 'request-screen.ur-code-column',
      dataKey: 'urCode',
      position: 'left',
      isSortable: true
    };

    const tableColumnFirstName: TableColumn = {
      name: 'request-screen.first-name-column',
      dataKey: 'firstName',
      position: 'left',
      isSortable: true
    };

    const tableColumnLastName: TableColumn = {
      name: 'request-screen.last-name-column',
      dataKey: 'lastName',
      position: 'left',
      isSortable: true
    };

    const tableColumnFemale: TableColumn = {
      name: 'request-screen.female-column',
      dataKey: 'female',
      position: 'left',
      isSortable: true
    };

    const tableColumnTypeIndividual: TableColumn = {
      name: 'request-screen.type-individual-column',
      dataKey: 'typeIndividual',
      position: 'left',
      isSortable: true
    };

    const tableColumnGroupCode: TableColumn = {
      name: 'request-screen.group-code-column',
      dataKey: 'groupCode',
      position: 'left',
      isSortable: true
    };

    const tableColumnReceptionDate: TableColumn = {
      name: 'request-screen.reception-date-column',
      dataKey: 'receptionDate',
      position: 'left',
      isSortable: true,
      isDate: true
    };

    const tableColumnStartDate: TableColumn = {
      name: 'request-screen.start-date-column',
      dataKey: 'startDate',
      position: 'left',
      isSortable: true,
      isDate: true
    };

    const tableColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.requestsTableColumns.push(tableColumnUrCode);
    this.requestsTableColumns.push(tableColumnFirstName);
    this.requestsTableColumns.push(tableColumnLastName);
    this.requestsTableColumns.push(tableColumnFemale);
    this.requestsTableColumns.push(tableColumnTypeIndividual);
    this.requestsTableColumns.push(tableColumnGroupCode);
    this.requestsTableColumns.push(tableColumnReceptionDate);
    this.requestsTableColumns.push(tableColumnStartDate);
    this.requestsTableColumns.push(tableColumnActions);
  }

  processListRequests(): void {
    if (this.allRequestsPagination.textFilter === null || this.allRequestsPagination.textFilter === '') {
      const requestArray: Array<Request> = new Array<Request>();
      const obs = this.requestService.listRequestsPagination(this.allRequestsPagination);
      if (obs !== null && obs !== undefined) {
        if (this.allRequestsSubscription !== undefined) {
          this.allRequestsSubscription.unsubscribe();
        }
        this.allRequestsSubscription = obs.subscribe(
          response => {
            const halObject = response as HalObject;

            if (halObject._embedded !== undefined) {
              halObject._embedded[environment.linksRequests].forEach(element => {
                const request: Request = Request.fromObject(element);
                if (request.firstName === 'MIRIAM') {

                } else {
                  requestArray.push(request);
                }

              });
              this.allRequests = requestArray;
            }
            if (response.page !== undefined) {
              this.allRequestsPagination.currentPag = response.page.number;
              this.allRequestsPagination.numberOfPages = response.page.totalPages;
              this.allRequestsPagination.totalElements = response.page.totalElements;
            }
          },
          error => {
            this.showNotification(error, 'notification-class');
          });
      }
    } else {
      let parameter: string;

      if (this.allRequestsPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ur-code').toLowerCase()) {
        parameter = 'urCode';
      } else if (this.allRequestsPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ext-code').toLowerCase()) {
        parameter = 'extCode';
      } else if (this.allRequestsPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-first-name').toLowerCase()) {
        parameter = 'firstName';
      } else if (this.allRequestsPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-last-name').toLowerCase()) {
        parameter = 'lastName';
      }

      this.requestService.getRequestByParameter(this.allRequestsPagination, parameter).subscribe(data => {
          const requestAux: Array<Request> = new Array<Request>();
          if (data._embedded !== null
            && data._embedded !== undefined
            && data._embedded[environment.linksRequests] !== null
            && data._embedded[environment.linksRequests] !== undefined) {
            data._embedded[environment.linksRequests].forEach(element => {
              requestAux.push(Request.fromObject(element));
            });
          }
          this.allRequests = requestAux;
        },
        error => {
          this.showNotification(error, 'notification-class');
        });
    }
  }

  processBankRequests(): void {
    if (this.bankRequestsPagination.textFilter === null || this.bankRequestsPagination.textFilter === '') {
      const requestArray: Array<Request> = new Array<Request>();
      const obs = this.requestService.listBankRequestsPagination(this.editingBank, this.bankRequestsPagination);
      if (obs !== null && obs !== undefined) {
        if (this.bankRequestsSubscription !== undefined) {
          this.bankRequestsSubscription.unsubscribe();
        }
        this.bankRequestsSubscription = obs.subscribe(
          response => {
            const halObject = response as HalObject;

            if (halObject._embedded !== undefined) {
              halObject._embedded[environment.linksRequests].forEach(element => {
                const request: Request = Request.fromObject(element);
                requestArray.push(request);
              });

              this.bankRequests = requestArray;
            }
            if (response.page !== undefined) {
              this.bankRequestsPagination.currentPag = response.page.number;
              this.bankRequestsPagination.numberOfPages = response.page.totalPages;
              this.bankRequestsPagination.totalElements = response.page.totalElements;
            }
          },
          error => {
            this.showNotification(error, 'notification-class');
          });
      }
    } else {
      let parameter: string;

      if (this.bankRequestsPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ur-code').toLowerCase()) {
        parameter = 'urCode';
      } else if (this.bankRequestsPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ext-code').toLowerCase()) {
        parameter = 'extCode';
      } else if (this.bankRequestsPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-first-name').toLowerCase()) {
        parameter = 'firstName';
      } else if (this.bankRequestsPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-last-name').toLowerCase()) {
        parameter = 'lastName';
      }

      this.requestService.getRequestByParameter(this.bankRequestsPagination, parameter).subscribe(data => {
          const requestAux: Array<Request> = new Array<Request>();
          if (data._embedded !== null
            && data._embedded !== undefined
            && data._embedded[environment.linksRequests] !== null
            && data._embedded[environment.linksRequests] !== undefined) {
            data._embedded[environment.linksRequests].forEach(element => {
              requestAux.push(Request.fromObject(element));
            });
          }
          this.bankRequests = requestAux;
        },
        error => {
          this.showNotification(error, 'notification-class');
        });
    }
  }
}
