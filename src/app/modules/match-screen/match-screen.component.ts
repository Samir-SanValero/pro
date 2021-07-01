import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConditionService } from '../../services/genetic/condition.service';
import { Subscription } from 'rxjs';
import { TableColumn } from '../common/table/table.model';
import { Rule } from '../../models/genetic-model';
import { Bank, MatchRequest, Request } from '../../models/administrative-model';
import { MatchRequestService } from '../../services/administrative/match-request.service';
import { RequestService } from '../../services/administrative/request.service';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';
import { HalObject, ImportMatchDialogData, Pagination } from '../../models/common-model';
import { BankService } from '../../services/administrative/bank.service';
import { MatDialog } from '@angular/material/dialog';
import { MatchImportDialogComponent } from './match-import-dialog/match-import-dialog.component';
import { isNumeric } from 'rxjs/internal-compatibility';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationComponent } from '../common/notification/notification.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-match-screen',
  templateUrl: './match-screen.component.html',
  styleUrls: ['./match-screen.component.scss']
})
export class MatchScreenComponent implements OnInit, OnDestroy {
  defaultPageSizes = environment.rulesTableDefaultPageSizes;
  pageSize: number = environment.rulesTableDefaultPageSizes[0];

  loading: boolean;
  matchPrepared: boolean;
  editing: boolean;
  adding: boolean;

  rules: Array<Rule>;
  matchRequests: Array<MatchRequest>;
  searchFields: Array<string>;

  // DO MATCH REQUEST
  MATCH_TARGET_OPTION_CUSTOM = 'custom';
  MATCH_TARGET_OPTION_PARTNER = 'partner';
  MATCH_TARGET_OPTION_BANK = 'bank';
  processingMatching: boolean;

  matchTargetOption: string;
  matchingRequest: Request;
  matchingPartner: Request;
  targetBankList: Array<Bank>;
  targetRequestList: Array<Request>;

  requestTableColumns: Array<TableColumn>;
  requestResultTableColumns: Array<TableColumn>;
  requestPagination: Pagination;
  requests: Array<Request>;
  requestsSubscription: Subscription;

  createMatchSubscription: Subscription;
  matchableSubscription: Subscription;
  bankTableColumns: Array<TableColumn>;
  bankPagination: Pagination;
  banks: Array<Bank>;
  banksSubscription: Subscription;
  requestMatchesSubscription: Subscription;
  requestResultsSubscription: Subscription;
  partnerSubscription: Subscription;

  constructor(
    public conditionService: ConditionService,
    public dialog: MatDialog,
    public matchRequestService: MatchRequestService,
    public requestService: RequestService,
    public bankService: BankService,
    public administrativeMock: AdministrativeMock,
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public notificationMessage: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('OPTION ROUTING: ' + this.route.snapshot.paramMap.get('option'));
    if (this.route.snapshot.paramMap.get('option') === 'custom') {
      console.log('setting value custom');
      this.changeTarget(this.MATCH_TARGET_OPTION_CUSTOM);
    } else if (this.route.snapshot.paramMap.get('option') === 'partner') {
      console.log('setting value partner');
      this.changeTarget(this.MATCH_TARGET_OPTION_PARTNER);
    } else if (this.route.snapshot.paramMap.get('option') === 'bank') {
      console.log('setting value bank');
      this.changeTarget(this.MATCH_TARGET_OPTION_BANK);
    }

    this.banks = new Array<Bank>();
    this.requests = new Array<Request>();
    this.loading = true;
    this.matchPrepared = false;
    this.bankPagination = new Pagination();
    this.requestPagination = new Pagination();
    this.targetRequestList = new Array<Request>();
    this.targetBankList = new Array<Bank>();
    this.searchFields = new Array<string>();

    this.searchFields.push(this.translateService.instant('request-screen.search-fields.request-first-name'));
    this.searchFields.push(this.translateService.instant('request-screen.search-fields.request-last-name'));
    this.searchFields.push(this.translateService.instant('request-screen.search-fields.request-ur-code'));
    this.searchFields.push(this.translateService.instant('request-screen.search-fields.request-ext-code'));

    this.loadRequestResultTable();
    this.loadBankTable();
    this.loadRequestTable();
    this.processListRequests();
    // this.processListBanks();
  }

  ngOnDestroy(): void {
    if (this.requestsSubscription !== undefined) {
      this.requestsSubscription.unsubscribe();
    }

    if (this.banksSubscription !== undefined) {
      this.banksSubscription.unsubscribe();
    }
  }

  newMatch(): void {
    this.adding = true;
  }

  backButton(): void {
    this.requestPagination = new Pagination();
    this.matchingRequest = undefined;
    this.adding = false;
    this.matchPrepared = false;
    this.processListRequests();
  }

  loadMatching(originRequest: Request): void {
    this.matchingRequest = originRequest;
    // this.matchingPartner = this.administrativeMock.generateRequest('2');
  }

  addBaseRequest(event: any): void {
    console.log('Adding base request');
    const request = event as Request;
    this.banks = new Array<Bank>();

    let alreadyAdded = false;

    for (const target of this.targetRequestList) {
      if (target === request) {
        alreadyAdded = true;
      }
    }

    if (!alreadyAdded) {
      this.matchingRequest = event as Request;

      if (request._links['precon:partner'] !== undefined) {
        if (request._links['precon:partner'].href !== undefined) {
          this.partnerSubscription = this.requestService.getPartnerRequest(request._links['precon:partner'].href)
            .subscribe((partnerData) => {
              if (partnerData !== undefined) {
                request.partner = partnerData as Request;
                this.matchingPartner = partnerData as Request;
                console.log('Recovered PARTNER: ' + partnerData.urCode);

                if (this.matchTargetOption === this.MATCH_TARGET_OPTION_PARTNER) {
                  if (this.targetRequestList === undefined) {
                    this.targetRequestList = new Array<Request>();
                  }
                  this.targetRequestList.push(this.matchingPartner);
                  this.matchPrepared = true;
                }
              }
            });
        }
      }

      if (request._links['precon:matchable-banks'] !== undefined) {
        if (request._links['precon:matchable-banks'].href !== undefined) {
          this.partnerSubscription = this.requestService.getMatchableBanks(request)
            .subscribe((banksData) => {
              if (banksData !== undefined) {
                const bankHal = banksData as HalObject;
                const bankArray = new Array<Bank>();

                if (bankHal._embedded !== undefined) {
                  if (bankHal._embedded['precon:banks'] !== undefined) {
                    bankHal._embedded['precon:banks'].forEach(element => {
                      const bank: Bank = Bank.fromObject(element);
                      bankArray.push(bank);
                    });
                    if (bankHal.page !== undefined) {
                      this.bankPagination.currentPag = bankHal.page.number;
                      this.bankPagination.numberOfPages = bankHal.page.totalPages;
                      this.bankPagination.totalElements = bankHal.page.totalElements;
                    }
                    this.banks = bankArray;
                  }
                }
              }
            });
        }
      }
    }
  }

  addTargetBank(event: any): void {
    console.log('Adding target bank');
    const bank = event as Bank;

    let alreadyAdded = false;

    for (const target of this.targetBankList) {
      if (target === bank) {
        alreadyAdded = true;
      }
    }

    if (!alreadyAdded) {
      this.targetBankList.push(bank);
      this.matchPrepared = true;
    }
  }

  addTargetRequest(event: any): void {
    console.log('Adding target request');
    const request = event as Request;

    if (request !== this.matchingRequest) {
      let alreadyAdded = false;

      for (const target of this.targetRequestList) {
        if (target === request) {
          alreadyAdded = true;
        }
      }

      if (!alreadyAdded) {
        this.targetRequestList.push(request);
        this.matchPrepared = true;
      }
    }
  }

  removeSelectedBase(): void {
    this.matchingRequest = undefined;
    this.matchingPartner = undefined;
    this.matchPrepared = false;
  }

  changeTarget(option: string): void {
    console.log('OPTION SELECTED: ' + option);
    if (option === this.MATCH_TARGET_OPTION_CUSTOM) {
      this.matchTargetOption = option;
      this.targetRequestList = new Array<Request>();
    } else if (option === this.MATCH_TARGET_OPTION_PARTNER) {
      this.matchTargetOption = option;
      this.targetRequestList = new Array<Request>();

    } else if (option === this.MATCH_TARGET_OPTION_BANK) {
      this.matchTargetOption = option;
      this.targetRequestList = new Array<Request>();
      this.targetBankList = new Array<Bank>();
    }
  }

  bulkRequestSelection(): void {
    console.log('Match screen - bulkRequestSelection');
    const requestList = new Array<Request>();

    const dialogData = {
      requests: requestList
    };

    console.log('Match screen - bulkRequestSelection opening dialog');
    const dialogRef = this.dialog.open(MatchImportDialogComponent, {
      width: '60%',
      height: '60%',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
      const dialogDataResult = result as ImportMatchDialogData;

      for (const request of dialogDataResult.requests) {
        this.targetRequestList.push(request);
      }
    });
  }

  removeSelectedRequest(targetRequest: Request): void {
    if (this.targetRequestList !== undefined) {
      this.targetRequestList.forEach( (item, index) => {
        if (item === targetRequest) {
          this.targetRequestList.splice(index, 1);
        }
        if (this.targetRequestList.length === 0) {
          this.matchPrepared = false;
        }
      });
    }
  }

  removeSelectedBank(targetBank: Bank): void {
    if (this.targetBankList !== undefined) {
      this.targetBankList.forEach( (item, index) => {
        if (item === targetBank) {
          this.targetBankList.splice(index, 1);
        }
        if (this.targetBankList.length === 0) {
          this.matchPrepared = false;
        }
      });
    }
  }

  completeMatch(): void {
    this.processingMatching = true;
    console.log('Match screen - match activated');
    if (this.matchTargetOption === this.MATCH_TARGET_OPTION_CUSTOM) {
      console.log('Match screen - Custom match');
      console.log('Match screen - Custom match - selected requests: ' + this.targetRequestList.length);
      this.createMatchSubscription = this.matchRequestService.createMatchRequest(
        this.getRequestId(this.matchingRequest),
        new MatchRequest()).subscribe((data) => {
        console.log('Match screen - Custom match - created match, adding target requests');
        const matchRequest = data as MatchRequest;
        this.matchRequestService.addTargetRequestsToMatchRequest(matchRequest, this.targetRequestList);
        this.showNotification('match-screen.messages.match-requested', 'notification-class');
      });

    } else if (this.matchTargetOption === this.MATCH_TARGET_OPTION_PARTNER) {
      console.log('Match screen - partner match');

      console.log('Match screen - Partner match - creating match with: ' + this.targetRequestList.length + ' target requests.');
      this.createMatchSubscription = this.matchRequestService.createMatchRequest(
        this.getRequestId(this.matchingRequest),
        new MatchRequest()).subscribe((data) => {
        console.log('Match screen - Partner match - created match, adding target requests');
        const matchRequest = data as MatchRequest;
        this.matchRequestService.addTargetRequestsToMatchRequest(matchRequest, this.targetRequestList);
        this.showNotification('match-screen.messages.match-requested', 'notification-class');
      });

    } else if (this.matchTargetOption === this.MATCH_TARGET_OPTION_BANK) {
      console.log('Match screen - bank match');

      console.log('Match screen - Bank match - selected banks: ' + this.targetBankList.length);
      this.targetRequestList = new Array<Request>();

      for (const bank of this.targetBankList) {
        this.addMatchableRequests(bank);
      }

      console.log('Bank match - creating match with: ' + this.targetRequestList.length + ' target requests.');
      this.createMatchSubscription = this.matchRequestService.createMatchRequest(
        this.getRequestId(this.matchingRequest),
        new MatchRequest()).subscribe((data) => {
        console.log('Match screen - Bank match - created match, adding target requests');
        const matchRequest = data as MatchRequest;
        this.matchRequestService.addTargetRequestsToMatchRequest(matchRequest, this.targetRequestList);
        this.showNotification('match-screen.messages.match-requested', 'notification-class');
      });
    }
  }

  loadRequestResultTable(): void {
    this.requestResultTableColumns = new Array<TableColumn>();

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

    const tableColumnResults: TableColumn = {
      name: 'match-screen.results-column',
      dataKey: 'results',
      position: 'left',
      isSortable: true
    };

    this.requestResultTableColumns.push(tableColumnUrCode);
    this.requestResultTableColumns.push(tableColumnFirstName);
    this.requestResultTableColumns.push(tableColumnLastName);
    this.requestResultTableColumns.push(tableColumnFemale);
    this.requestResultTableColumns.push(tableColumnTypeIndividual);
    this.requestResultTableColumns.push(tableColumnGroupCode);
    this.requestResultTableColumns.push(tableColumnResults);
  }

  loadRequestTable(): void {
    this.requestTableColumns = new Array<TableColumn>();

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

    this.requestTableColumns.push(tableColumnUrCode);
    this.requestTableColumns.push(tableColumnFirstName);
    this.requestTableColumns.push(tableColumnLastName);
    this.requestTableColumns.push(tableColumnFemale);
    this.requestTableColumns.push(tableColumnTypeIndividual);
    this.requestTableColumns.push(tableColumnGroupCode);
    this.requestTableColumns.push(tableColumnReceptionDate);
    this.requestTableColumns.push(tableColumnStartDate);

    // this.tableService.selectPageSize(this.pageSize);
  }

  loadBankTable(): void {
    this.bankTableColumns = new Array<TableColumn>();

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

    this.bankTableColumns.push(tableColumnCode);
    this.bankTableColumns.push(tableColumnName);
    this.bankTableColumns.push(tableColumnGroupCode);
  }

  processListRequests(): void {
    if (this.requestPagination.textFilter === null || this.requestPagination.textFilter === '') {
      const requestArray: Array<Request> = new Array<Request>();
      const obs = this.requestService.listRequestsPagination(this.requestPagination);
      if (obs !== null && obs !== undefined) {
        if (this.requestsSubscription !== undefined) {
          this.requestsSubscription.unsubscribe();
        }
        this.requestsSubscription = obs.subscribe(
          response => {
            const halObject = response as HalObject;

            if (halObject._embedded !== undefined) {
              halObject._embedded[environment.linksRequests].forEach(element => {
                const request: Request = Request.fromObject(element);
                requestArray.push(request);
              });
              this.requests = requestArray;
              this.loading = false;
              this.addMatchInfo();
            }
            if (response.page !== undefined) {
              this.requestPagination.currentPag = response.page.number;
              this.requestPagination.numberOfPages = response.page.totalPages;
              this.requestPagination.totalElements = response.page.totalElements;
            }
          },
          error => {
            this.showNotification(error, 'notification-class');
          });
      }
    } else {
      let parameter: string;

      if (this.requestPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ur-code').toLowerCase()) {
        parameter = 'urCode';
      } else if (this.requestPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ext-code').toLowerCase()) {
        parameter = 'extCode';
      } else if (this.requestPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-first-name').toLowerCase()) {
        parameter = 'firstName';
      } else if (this.requestPagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-last-name').toLowerCase()) {
        parameter = 'lastName';
      }

      this.requestService.getRequestByParameter(this.requestPagination, parameter).subscribe(data => {
          const requestAux: Array<Request> = new Array<Request>();
          if (data._embedded !== null
            && data._embedded !== undefined
            && data._embedded[environment.linksRequests] !== null
            && data._embedded[environment.linksRequests] !== undefined) {
            data._embedded[environment.linksRequests].forEach(element => {
              requestAux.push(Request.fromObject(element));
            });
          }
          this.requests = requestAux;
          this.loading = false;

          if (data.page !== undefined) {
            this.requestPagination.currentPag = data.page.number;
            this.requestPagination.numberOfPages = data.page.totalPages;
            this.requestPagination.totalElements = data.page.totalElements;
          }

          this.addMatchInfo();
        },
        error => {
          // this.showNotification(error, 'notification-class');
        });
    }
  }

  processListBanks(): void {
    const list = new Array<Bank>();
    const obs = this.bankService.listBanksPagination(this.bankPagination);
    if (obs !== null && obs !== undefined) {
      this.banksSubscription = obs.subscribe((data) => {
        console.log('Match request screen - recovered banks: ' + data._embedded[environment.linksBanks].length);
        if (data._embedded !== undefined && data._embedded[environment.linksBanks] !== undefined) {
          data._embedded[environment.linksBanks].forEach(element => {
            list.push(Bank.fromObject(element));
          });
          this.banks = list;
        }
        if (data.page !== undefined) {
          this.bankPagination.currentPag = data.page.number;
          this.bankPagination.numberOfPages = data.page.totalPages;
          this.bankPagination.totalElements = data.page.totalElements;
        }

        this.loading = false;
      });
    }
  }

  sortRequests(event: any): void {
    this.requestPagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
      this.requestPagination.sortField = event.active;
      this.requestPagination.sortOrder = event.direction;
    }
    this.processListRequests();
  }

  sortBanks(event: any): void {
    this.bankPagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
      this.bankPagination.sortField = event.active;
      this.bankPagination.sortOrder = event.direction;
    }
    this.processListBanks();
  }

  requestTablePageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.requestPagination.totalElements = event.length;
      this.requestPagination.currentPag = event.pageIndex;
      this.requestPagination.currentPagSize = event.pageSize;
    }
    this.processListRequests();
  }

  bankTablePageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.bankPagination.totalElements = event.length;
      this.bankPagination.currentPag = event.pageIndex;
      this.bankPagination.currentPagSize = event.pageSize;
    }
    this.processListBanks();
  }

  getRequestId(request: Request): string {
    const stringElements = request._links.self.href.split('/');

    for (const element of stringElements) {
      if (isNumeric(element)) {
        return element;
      }
    }

    return undefined;
  }

  addMatchableRequests(bank: Bank): void {
    if (this.matchableSubscription !== undefined) {
      this.matchableSubscription.unsubscribe();
    }

    this.matchableSubscription = this.bankService.findMatchableRequestFromRequest(bank, this.matchingRequest).subscribe((data) => {
      if (data !== undefined) {
        const matchables = data as Array<Request>;
        console.log('Match screen - Bank match - found: ' + matchables.length + ' matchables.');
        if (matchables.length > 0) {
          for (const matchable of matchables) {
            this.targetRequestList.push(matchable);
          }
        }
      }
    });
  }

  textFiltered(event): void {
    if (event !== null && event !== undefined) {
      this.requestPagination.textFilter = event.target.value;
      this.requestPagination.currentPag = 0;
      this.requestPagination.textField = event.field;
    }
    this.processListRequests();
  }

  addMatchInfo(): void {
    for (const request of this.requests) {
      console.log('Adding match info of: ' + request._links.self.href);
      if (request._links['precon:match-requests'] !== undefined) {
        if (request._links['precon:match-requests'].href !== undefined) {
          console.log('With URL: ' + request._links['precon:match-requests'].href);
        }
      }

      if (this.requestMatchesSubscription !== undefined) {
        this.requestMatchesSubscription.unsubscribe();
      }

      const list = new Array<MatchRequest>();

      if (request._links['precon:match-requests'] !== undefined) {
        if (request._links['precon:match-requests'].href !== undefined) {
          this.requestMatchesSubscription = this.requestService.getRequestMatches(request).subscribe((data) => {
            console.log('Request screen - recovered requests');
            if (data._embedded !== undefined && data._embedded[environment.linksMatchRequests] !== undefined) {
              console.log('Found match requests: ' + data._embedded[environment.linksMatchRequests].length);
              data._embedded[environment.linksMatchRequests].forEach(element => {

                const matchRequest = MatchRequest.fromObject(element);
                console.log('Found match request: ' + matchRequest._links.self.href);
                // matchRequest.matchResults = this.addResultInfo(matchRequest);

                list.push(matchRequest);
              });
              request.matchRequests = list;
            }
            if (data.page !== undefined) {
              this.requestPagination.currentPag = data.page.number;
              this.requestPagination.numberOfPages = data.page.totalPages;
              this.requestPagination.totalElements = data.page.totalElements;
            }
          });
        }
      }
    }
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
}
