import { Component, OnDestroy, OnInit } from '@angular/core';
import { Country, Ethnicity, MatchRequest, Request } from '../../models/administrative-model';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequestService } from '../../services/administrative/request.service';
import {
  CnvMetrics,
  CnvRequest,
  Disease,
  FoundMutation,
  Gene,
  Genotype,
  Mutation, NoNgsAcceptedValues,
  NoNgsMutation,
  PolyTTract, StudiedMutation, UncoveredMutation
} from '../../models/genetic-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../common/notification/notification.component';
import { TableColumn } from '../common/table/table.model';
import { GenotypeService } from '../../services/genetic/genotype.service';
import { FoundMutationService } from '../../services/genetic/found-mutation.service';
import { NoNgsMutationService } from '../../services/genetic/no-ngs-mutation.service';
import { CnvRequestService } from '../../services/genetic/cnv-request.service';
import { EthnicityService } from '../../services/administrative/ethnicity.service';
import { CountryService } from '../../services/administrative/country.service';
import { FormControl } from '@angular/forms';
import { catchError, map, startWith } from 'rxjs/operators';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { TableService } from '../../services/common/table.service';
import { HalObject } from '../../models/common-model';
import { GeneService } from '../../services/genetic/gene.service';
import { DiseaseService } from '../../services/genetic/disease.service';
import { MutationService } from '../../services/genetic/mutation.service';
import { Pagination } from '../../models/common-model';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../common/confirm-dialog/confirm-dialog.component';
import { GeneticMock } from '../../services/genetic/genetic.mock';
import { ReportComponent } from '../reports/report/report.component';
import { Requestor } from '../../models/requestor.model';
import { ExportExcelService } from '../../services/report/export-excel.service';
import { StudiedMutationService } from '../../services/genetic/studied-mutation.service';
import { UncoveredMutationService } from '../../services/genetic/uncovered-mutation.service';
import * as FileSaver from 'file-saver';
import { CoupleMatchReportStatus, IndividualReportStatus, SomeDonorsReportStatus } from '../../models/report-model';
import {NewRequestModel} from './new-request/new-request.model';
import {NewRequestComponent} from './new-request/new-request.component';

@Component({
  selector: 'app-request-screen',
  templateUrl: './request-screen.component.html',
  styleUrls: ['./request-screen.component.scss']
})
export class RequestScreenComponent implements OnInit, OnDestroy {
  defaultPageSizes = environment.requestTableDefaultPageSizes;
  page: number;
  pageSize: number = environment.requestTableDefaultPageSizes[0];
  sortField: string;
  sort: string;

  pagination: Pagination;
  paginationPartnerRequests: Pagination;
  paginationMatchRequests: Pagination;
  paginationUncovereds: Pagination;

  loading: boolean;
  showRecord: boolean;
  unlockFields: boolean;
  adding: boolean;
  togglingActivation: boolean;
  togglingBlock: boolean;
  togglingValidated: boolean;
  dialogResult: boolean;

  requestFilterEvent: any;

  countryControl: FormControl;
  ethnicityControl: FormControl;
  partnerControl: FormControl;
  individualTypeFormControl: FormControl;
  birthdayControl: FormControl;
  startDateControl: FormControl;
  endDateControl: FormControl;

  noNgsMutationFormControl: FormControl;
  noNgsMutationFormSpinner: boolean;

  noNgsGeneFormControl: FormControl;
  noNgsGeneFormSpinner: boolean;

  noNgsDiseaseFormControl: FormControl;
  noNgsDiseaseFormSpinner: boolean;

  changePageSubscription: Subscription;
  changePageSizeSubscription: Subscription;

  requestsSubscription: Subscription;
  genotypeSubscription: Subscription;
  genotypeDataSubscription: Subscription;
  deleteNoNgsMutationSubscription: Subscription;
  partnerSubscription: Subscription;
  ethnicityLanguageSubscription: Subscription;
  countryLanguageSubscription: Subscription;
  addRequestSubscription: Subscription;
  geneSubscription: Subscription;
  mutationSubscription: Subscription;
  diseaseSubscription: Subscription;
  matchRequestSubscription: Subscription;
  matchRequestReportSubscription: Subscription;
  noNgsAcceptedValuesSubscription: Subscription;

  individualReportSubscription: Subscription;
  coupleReportSubscription: Subscription;
  donorReportSubscription: Subscription;
  downloadReportSubscription: Subscription;

  editingRequest: Request;
  partnerRequest: Request;
  editingNoNgsMutation: NoNgsMutation;

  requests: Request[];
  requestsPartner: Request[];
  requestsUnsorted: Request[];

  genotype: Genotype;

  countries: Country[];
  countriesFiltered: Observable<Country[]>;

  ethnicities: Ethnicity[];
  ethnicitiesFiltered: Observable<Ethnicity[]>;

  partnerRequests: Request[];
  partnerRequestsFiltered: Observable<Request[]>;

  individualTypes: string[];

  genes: Gene[];
  genesFiltered: Observable<Gene[]>;

  diseases: Disease[];
  diseasesFiltered: Observable<Disease[]>;

  mutations: Mutation[];
  mutationsFiltered: Observable<any>;

  matchRequests: Array<MatchRequest>;

  tableColumns: Array<TableColumn>;
  foundMutationColumns: Array<TableColumn>;
  noNgsMutationColumns: Array<TableColumn>;
  cnvColumns: Array<TableColumn>;
  matchRequestColumns: Array<TableColumn>;
  risksColumns: Array<TableColumn>;

  genePagination: Pagination;
  diseasePagination: Pagination;
  mutationPagination: Pagination;
  searchFields: Array<string>;

  reportDialogRef: MatDialogRef<ReportComponent>;

  noNgsAcceptedValues: Array<NoNgsAcceptedValues>;

  constructor(
    public requestService: RequestService,
    public genotypeService: GenotypeService,
    public dialog: MatDialog,
    public notificationMessage: MatSnackBar,
    public foundMutationService: FoundMutationService,
    public noNgsMutationService: NoNgsMutationService,
    public cnvService: CnvRequestService,
    public ethnicityService: EthnicityService,
    public countryService: CountryService,
    public translateService: TranslateService,
    public tableService: TableService,
    public geneService: GeneService,
    public diseaseService: DiseaseService,
    public mutationService: MutationService,
    public geneticMock: GeneticMock,
    public excelService: ExportExcelService,
    public studiedMutationService: StudiedMutationService,
    public uncoveredMutationService: UncoveredMutationService
  ) { }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.currentPagSize = this.pageSize;

    this.paginationPartnerRequests = new Pagination();
    this.paginationPartnerRequests.currentPagSize = this.pageSize;

    this.paginationMatchRequests = new Pagination();
    this.paginationMatchRequests.currentPagSize = this.pageSize;

    this.loading = true;

    this.tableColumns = new Array<TableColumn>();

    const tableColumnActive: TableColumn = {
      name: 'request-screen.active-column',
      dataKey: 'active',
      position: 'left',
      isSortable: false,
      showBooleanIcon: true
    };

    const tableColumnValidated: TableColumn = {
      name: 'request-screen.validated-column',
      dataKey: 'validated',
      position: 'left',
      isSortable: false,
      showBooleanIcon: true,
      showBooleanCustomIcon: 'check_circle',
      showBooleanCustomIconFalse: 'check_circle_outline'
    };

    const tableColumnBlocked: TableColumn = {
      name: 'request-screen.blocked-column',
      dataKey: 'blocked',
      position: 'left',
      isSortable: true,
      showBooleanIcon: true,
      showBooleanCustomIcon: 'lock',
      showBooleanCustomIconFalse: 'lock_open'
    };

    const tableColumnExtCode: TableColumn = {
      name: 'request-screen.external-code-column',
      dataKey: 'externalCode',
      position: 'left',
      isSortable: true
    };

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

    this.tableColumns.push(tableColumnActive);
    this.tableColumns.push(tableColumnBlocked);
    this.tableColumns.push(tableColumnValidated);
    this.tableColumns.push(tableColumnExtCode);
    this.tableColumns.push(tableColumnUrCode);
    this.tableColumns.push(tableColumnFirstName);
    this.tableColumns.push(tableColumnLastName);
    this.tableColumns.push(tableColumnFemale);
    this.tableColumns.push(tableColumnTypeIndividual);
    this.tableColumns.push(tableColumnGroupCode);
    this.tableColumns.push(tableColumnReceptionDate);
    this.tableColumns.push(tableColumnStartDate);
    this.tableColumns.push(tableColumnActions);

    this.tableService.selectPageSize(this.pageSize);

    this.genePagination = new Pagination(0, this.pageSize, 0, 0, 'asc', 'geneName');
    this.diseasePagination = new Pagination(0, this.pageSize, 0, 0, 'asc', 'omim');
    this.mutationPagination = new Pagination(0, this.pageSize, 0, 0, 'asc', 'accession');

    this.searchFields = new Array<string>();

    this.searchFields.push(this.translateService.instant('request-screen.search-fields.request-first-name'));
    this.searchFields.push(this.translateService.instant('request-screen.search-fields.request-last-name'));
    this.searchFields.push(this.translateService.instant('request-screen.search-fields.request-ur-code'));
    this.searchFields.push(this.translateService.instant('request-screen.search-fields.request-ext-code'));

    this.processListRequests();
    this.loadGeneticData();
  }

  ngOnDestroy(): void {
    if (this.changePageSubscription !== undefined) {
      this.changePageSubscription.unsubscribe();
    }

    if (this.changePageSizeSubscription !== undefined) {
      this.changePageSizeSubscription.unsubscribe();
    }

    if (this.requestsSubscription !== undefined) {
      this.requestsSubscription.unsubscribe();
    }

    if (this.genotypeSubscription !== undefined) {
      this.genotypeSubscription.unsubscribe();
    }

    if (this.genotypeDataSubscription !== undefined) {
      this.genotypeDataSubscription.unsubscribe();
    }

    if (this.deleteNoNgsMutationSubscription !== undefined) {
      this.deleteNoNgsMutationSubscription.unsubscribe();
    }

    if (this.partnerSubscription !== undefined) {
      this.partnerSubscription.unsubscribe();
    }

    if (this.ethnicityLanguageSubscription !== undefined) {
      this.ethnicityLanguageSubscription.unsubscribe();
    }

    if (this.countryLanguageSubscription !== undefined) {
      this.countryLanguageSubscription.unsubscribe();
    }

    if (this.geneSubscription !== undefined) {
      this.geneSubscription.unsubscribe();
    }

    if (this.mutationSubscription !== undefined) {
      this.mutationSubscription.unsubscribe();
    }

    if (this.diseaseSubscription !== undefined) {
      this.diseaseSubscription.unsubscribe();
    }

    if (this.matchRequestSubscription !== undefined) {
      this.matchRequestSubscription.unsubscribe();
    }

    if (this.individualReportSubscription !== undefined) {
      this.individualReportSubscription.unsubscribe();
    }
    if (this.coupleReportSubscription !== undefined) {
      this.coupleReportSubscription.unsubscribe();
    }
    if (this.donorReportSubscription !== undefined) {
      this.donorReportSubscription.unsubscribe();
    }
  }

  loadGeneticData(): void {
    this.noNgsDiseaseFormControl = new FormControl();
    this.noNgsMutationFormControl = new FormControl();
    this.noNgsGeneFormControl = new FormControl();

    this.noNgsAcceptedValuesSubscription = this.noNgsMutationService.listNoNgsAcceptedValues().subscribe((acceptedValuesData) => {
      this.noNgsAcceptedValues = acceptedValuesData as Array<NoNgsAcceptedValues>;
    });

    this.geneSubscription = this.geneService.listGenesPagination(this.genePagination)
        .subscribe((genesData) => {
      const genesHalObject = genesData as HalObject;
      this.genes = genesHalObject._embedded[environment.linksGenes] as Gene[];

      this.genesFiltered = this.noNgsGeneFormControl.valueChanges
          .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.type),
              map(type => type ? this.filterGenes(type) : this.genes.slice())
          );

      console.log('Request screen - Recovered genes, total: ' + this.genes.length);
    },
    error => {
      this.showNotification(error);
    });

    this.diseaseSubscription = this.diseaseService.listDiseasePagination(this.diseasePagination)
        .subscribe((diseasesData) => {
      const diseasesHalObject = diseasesData as HalObject;
      this.diseases = diseasesHalObject._embedded[environment.linksDiseases] as Disease[];

      for (const disease of this.diseases) {
        for (const translation of disease.translations) {
          if (translation.language.toLowerCase() === environment.langES.toLowerCase()) {
            disease.nameView = translation.name;
          }
        }
      }

      this.diseasesFiltered = this.noNgsDiseaseFormControl.valueChanges
          .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.type),
              map(type => type ? this.filterDiseases(type) : this.diseases.slice())
          );

      console.log('Request screen - Recovered diseases, total: ' + this.diseases.length);
    },
    error => {
      this.showNotification(error);
    });

    this.mutationSubscription =
        this.mutationService.listMutationPagination(this.mutationPagination)
        .subscribe((mutationsData) => {
      const mutationsHalObject = mutationsData as HalObject;
      this.mutations = mutationsHalObject._embedded[environment.linksMutations] as Mutation[];

      this.mutationsFiltered = this.noNgsMutationFormControl.valueChanges
          .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.type),
              map(type => type ? this.filterMutations(type) : this.mutations.slice())
          );

      console.log('Request screen - Recovered mutations, total: ' + this.mutations.length);
    },
    error => {
      this.showNotification(error);
    });
  }

  loadPartnerData(): void {
    this.partnerControl = new FormControl();

    this.partnerRequestsFiltered = this.partnerControl.valueChanges
      .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.type),
          map(type => type ? this.filterPartnerRequests(type) : this.partnerRequests.slice())
      );
  }

  addRequest(): void {
    const dialogData = new NewRequestModel(
      'request-screen.messages.request-confirmation-title',
      'request-screen.messages.request-modification-confirmation',
      'common-elements.messages.confirmation-dialog-accept',
      'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(NewRequestComponent, {
      maxWidth: '1600px',
      maxHeight: '1000px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogResult = dialogResult as boolean;
    });



    // console.log('Request screen component - addRequest');
    //
    // this.editingRequest = new Request();
    // this.editingRequest.genotype = new Genotype();
    //
    // this.editingRequest.genotype.foundMutations = new Array<FoundMutation>();
    // this.editingRequest.genotype.noNgsMutations = new Array<NoNgsMutation>();
    // this.editingRequest.genotype.cnvs = new Array<CnvRequest>();
    //
    // this.genotype = new Genotype();
    //
    // this.birthdayControl = new FormControl();
    // this.startDateControl = new FormControl();
    // this.endDateControl = new FormControl();
    // this.countryControl = new FormControl();
    // this.ethnicityControl = new FormControl();
    // this.partnerControl = new FormControl();
    // this.individualTypeFormControl = new FormControl();
    // this.togglingActivation = false;
    // this.togglingBlock = false;
    // this.togglingValidated = false;
    // this.editingNoNgsMutation = new NoNgsMutation();
    // this.partnerRequest = new Request();
    //
    // this.showRecord = true;
    // this.adding = true;
    //
    // this.individualTypes = [
    //   this.editingRequest.typeIndividualSinglePerson,
    //   this.editingRequest.typeIndividualCouple,
    //   this.editingRequest.typeIndividualDonor,
    //   this.editingRequest.typeIndividualRecipient
    // ];
    //
    // this.loadFoundMutationTable();
    // this.loadNoNgsMutationTable();
    // this.loadCnvTable();
    //
    // const countryObservable = this.countryService.listCountries();
    // const ethnicityObservable = this.ethnicityService.listEthnicities();
    //
    // const countryList = new Array<Country>();
    // const countryElement = new Country();
    // const ethnicityList = new Array<Ethnicity>();
    // const ethnicityElement = new Ethnicity();
    //
    // if (this.genotypeSubscription !== undefined) {
    //   this.genotypeSubscription.unsubscribe();
    // }
    //
    // this.genotypeDataSubscription = forkJoin({
    //   ethnicityData: ethnicityObservable,
    //   countryData: countryObservable,
    // }).subscribe(({
    //                 ethnicityData,
    //                 countryData,
    //               }) => {
    //   this.countries = countryData as Array<Country>;
    //   this.ethnicities = ethnicityData as Array<Ethnicity>;
    //
    //   console.log('COUNTRIES: ' + this.countries.length);
    //   console.log('ETHNICITIES: ' + this.ethnicities.length);
    //
    //   for (const ethnicity of this.ethnicities) {
    //     for (const translation of ethnicity.translations) {
    //       if (translation.language.toLowerCase() === environment.langES.toLowerCase()) {
    //         ethnicity.viewTranslation = translation.name;
    //       }
    //     }
    //     ethnicityList.push(ethnicityElement.fromObject(ethnicity));
    //   }
    //
    //   for (const country of this.countries) {
    //     for (const translation of country.translations) {
    //       if (translation.language.toLowerCase() === environment.langES.toLowerCase()) {
    //         country.viewTranslation = translation.name;
    //       }
    //     }
    //     countryList.push(countryElement.fromObject(country));
    //   }
    //
    //   this.countries = countryList;
    //   this.ethnicities = ethnicityList;
    //
    //   this.countriesFiltered = this.countryControl.valueChanges
    //       .pipe(
    //           startWith(''),
    //           map(value => typeof value === 'string' ? value : value.type),
    //           map(type => type ? this.filterCountries(type) : this.countries.slice())
    //       );
    //
    //   this.ethnicitiesFiltered = this.ethnicityControl.valueChanges
    //       .pipe(
    //           startWith(''),
    //           map(value => typeof value === 'string' ? value : value.type),
    //           map(type => type ? this.filterEthnicities(type) : this.ethnicities.slice())
    //       );
    // });
  }

  editRequest(request: Request): void {
    console.log('Request screen - editing request');
    this.editingRequest = request;

    this.birthdayControl = new FormControl();
    this.startDateControl = new FormControl();
    this.endDateControl = new FormControl();
    this.countryControl = new FormControl();
    this.ethnicityControl = new FormControl();
    this.partnerControl = new FormControl();
    this.individualTypeFormControl = new FormControl();
    this.togglingActivation = false;
    this.togglingBlock = false;
    this.togglingValidated = false;
    this.editingNoNgsMutation = new NoNgsMutation();
    this.partnerRequest = new Request();

    this.birthdayControl.patchValue(request.birthday);
    this.startDateControl.patchValue(request.startDate);
    this.endDateControl.patchValue(request.endDate);

    this.unlockFields = false;

    this.countryControl.disable();
    this.ethnicityControl.disable();
    this.partnerControl.disable();
    this.individualTypeFormControl.disable();
    this.birthdayControl.disable();
    this.startDateControl.disable();
    this.endDateControl.disable();

    this.loadFoundMutationTable();
    this.loadNoNgsMutationTable();
    this.loadCnvTable();
    this.loadMatchRequestTable();
    this.loadRisksTable();

    if (request.typeIndividual === request.typeIndividualCouple) {
      this.processListRequestsPartner();
      this.loadPartnerData();
    }

    for (const loadedRequest of this.requests) {
      if (request.urCode === loadedRequest.urCode) {
        console.log('Found request to be edited');
        request = loadedRequest;
      }
    }

    this.observeLanguageChanges();

    if (request.typeIndividual !== undefined && request.typeIndividual === request.typeIndividualCouple) {
      this.partnerSubscription = this.requestService.getPartnerRequest(request._links['precon:partner'].href)
        .subscribe((partnerData) => {
          this.partnerRequest = partnerData as Request;
          console.log('---------------RECOVERED PARTNER: ' + this.partnerRequest.urCode);
          this.partnerControl.patchValue(this.partnerRequest);
        }, err => {
          this.partnerRequest = undefined;
          console.log(err);
        });
    } else {
      this.partnerRequest = undefined;
    }

    // Load genotype of request
    this.genotypeSubscription = this.genotypeService.getGenotypeByRequest(request._links['precon:genotype'].href)
        .subscribe((genotypeData) => {
      console.log('Loading request genotype ' + request._links['precon:genotype'].href);
      this.genotype = genotypeData as Genotype;

      let cnvObservable;
      let foundMutationsObservable;
      let noNgsMutationObservable;
      let riskObservable;
      let uncoveredObservable;
      let ethnicityObservable;
      let countryObservable;
      let ethnicityOfRequestObservable;
      let countryOfRequestObservable;

      if (this.genotype._links !== undefined) {
        if (this.genotype._links['precon:found-mutations'] !== undefined) {
          if (this.genotype._links['precon:found-mutations'].href !== undefined) {
            foundMutationsObservable = this.foundMutationService.getFoundMutationsByGenotype(this.genotype);
            console.log('FOUND MUTATION OBSERVABLE: ' + foundMutationsObservable);
          } else {
            console.log('Found mutations href undefined');
            const halObject = new HalObject();
            halObject._embedded = new Array<FoundMutation>();
            foundMutationsObservable = of(halObject);
          }
        } else {
          console.log('Found mutations undefined');
          const halObject = new HalObject();
          halObject._embedded = new Array<FoundMutation>();
          foundMutationsObservable = of(halObject);
        }

        if (this.genotype._links['precon:no-ngs'] !== undefined) {
          if (this.genotype._links['precon:no-ngs'].href !== undefined) {
            noNgsMutationObservable = this.noNgsMutationService.getNoNgsMutationByGenotype(this.genotype);
            console.log('NO NGS MUTATION OBSERVABLE: ' + noNgsMutationObservable);
          } else {
            const halObject = new HalObject();
            halObject._embedded = new Array<NoNgsMutation>();
            noNgsMutationObservable = of(halObject);
          }
        } else {
          const halObject = new HalObject();
          halObject._embedded = new Array<NoNgsMutation>();
          noNgsMutationObservable = of(halObject);
        }

        if (this.genotype._links['precon:cnvs'] !== undefined) {
          if (this.genotype._links['precon:cnvs'].href !== undefined) {
            cnvObservable = this.cnvService.getCnvRequestByGenotype(this.genotype);
            console.log('CNV OBSERVABLE: ' + cnvObservable);
          } else {
            const halObject = new HalObject();
            halObject._embedded = new Array<CnvRequest>();
            cnvObservable = of(halObject);
          }
        } else {
          const halObject = new HalObject();
          halObject._embedded = new Array<CnvRequest>();
          cnvObservable = of(halObject);
        }

        if (this.genotype._links['precon:risks'] !== undefined) {
          if (this.genotype._links['precon:risks'].href !== undefined) {
            riskObservable = this.studiedMutationService.getStudiedMutationsByGenotype(this.genotype);
            console.log('RISKS OBSERVABLE: ' + riskObservable);
          } else {
            const halObject = new HalObject();
            halObject._embedded = new Array<StudiedMutation>();
            riskObservable = of(halObject);
          }
        } else {
          const halObject = new HalObject();
          halObject._embedded = new Array<StudiedMutation>();
          riskObservable = of(halObject);
        }

        if (this.genotype._links[environment.linksUncoveredMutations] !== undefined) {
          if (this.genotype._links[environment.linksUncoveredMutations].href !== undefined) {
            uncoveredObservable = this.uncoveredMutationService.getUncoveredMutationsByGenotype(this.genotype);
            console.log('UNCOVERED OBSERVABLE: ' + uncoveredObservable);
          } else {
            const halObject = new HalObject();
            halObject._embedded = new Array<UncoveredMutation>();
            uncoveredObservable = of(halObject);
          }
        } else {
          const halObject = new HalObject();
          halObject._embedded = new Array<UncoveredMutation>();
          uncoveredObservable = of(halObject);
        }
      }
          console.log('LOG 3');
      if (this.editingRequest._links !== undefined) {
        if (this.editingRequest._links['precon:countries'] !== undefined) {
          if (this.editingRequest._links['precon:countries'].href !== undefined) {
            countryObservable = this.countryService.listCountriesByRequest(this.editingRequest._links['precon:countries'].href);
          } else {
            countryObservable = of(new Array<Country>());
          }
        } else {
          countryObservable = of(new Array<Country>());
        }

        if (this.editingRequest._links['precon:ethnicities'] !== undefined) {
          if (this.editingRequest._links['precon:ethnicities'].href !== undefined) {
            ethnicityObservable = this.ethnicityService.listEthnicitiesByRequest(this.editingRequest._links['precon:ethnicities'].href);
          } else {
            ethnicityObservable = of(new Array<Ethnicity>());
          }
        } else {
          ethnicityObservable = of(new Array<Ethnicity>());
        }

        if (this.editingRequest._links['precon:ethnicity'] !== undefined) {
          if (this.editingRequest._links['precon:ethnicity'].href !== undefined) {
            ethnicityOfRequestObservable = this.ethnicityService.getEthnicityOfRequest(this.editingRequest._links['precon:ethnicity'].href)
                .pipe(catchError(() => of (new Ethnicity())));
          } else {
            ethnicityOfRequestObservable = of(new Ethnicity());
          }
        } else {
          ethnicityOfRequestObservable = of(new Ethnicity());
        }

        if (this.editingRequest._links['precon:country'] !== undefined) {
          if (this.editingRequest._links['precon:country'].href !== undefined) {
            countryOfRequestObservable =
                this.countryService.getCountryOfRequest(this.editingRequest._links['precon:country'].href)
                    .pipe(catchError(() => of (new Country())));
          } else {
            countryOfRequestObservable = of(new Country());
          }
        } else {
          countryOfRequestObservable = of(new Country());
        }
      }

      this.genotypeDataSubscription = forkJoin({
        foundMutationData: foundMutationsObservable,
        noNgsMutationData: noNgsMutationObservable,
        cnvData: cnvObservable,
        riskData: riskObservable,
        uncoveredData: uncoveredObservable,
        ethnicityData: ethnicityObservable,
        countryData: countryObservable,
        ethnicityOfRequestData: ethnicityOfRequestObservable,
        countryOfRequestData: countryOfRequestObservable
      }).subscribe(({
                          foundMutationData,
                          noNgsMutationData,
                          cnvData,
                          riskData,
                          uncoveredData,
                          ethnicityData,
                          countryData,
                          ethnicityOfRequestData,
                          countryOfRequestData
      }) => {
        console.log('LOG 4');
        const halObjectFound = foundMutationData as HalObject;
        this.genotype.foundMutations = halObjectFound._embedded[environment.linksFoundMutations] as Array<FoundMutation>;

        const halObjectNoNgs = noNgsMutationData as HalObject;
        this.genotype.noNgsMutations = halObjectNoNgs._embedded[environment.linksMutationNoNgs] as Array<NoNgsMutation>;

        const halObjectCnv = cnvData as HalObject;
        this.genotype.cnvs = halObjectCnv._embedded[environment.linksCnvRequests] as Array<CnvRequest>;

        const halObjectRisk = riskData as HalObject;
        this.genotype.foundMutations = halObjectRisk._embedded[environment.linksRisks] as Array<FoundMutation>;

        const halObjectUncovered = uncoveredData as HalObject;
        this.genotype.uncoveredMutations = halObjectUncovered._embedded[environment.linksUncovered] as Array<UncoveredMutation>;

        this.countries = countryData as Array<Country>;
        this.ethnicities = ethnicityData as Array<Ethnicity>;

        this.editingRequest.ethnicity = ethnicityOfRequestData as Ethnicity;
        this.editingRequest.country = countryOfRequestData as Country;

        const foundMutationList = new Array<FoundMutation>();

        const noNgsMutationList = new Array<NoNgsMutation>();

        const cnvList = new Array<CnvRequest>();

        const uncoveredList = new Array<UncoveredMutation>();
        const riskList = new Array<StudiedMutation>();

        const countryList = new Array<Country>();
        const countryElement = new Country();
        const ethnicityList = new Array<Ethnicity>();
        const ethnicityElement = new Ethnicity();

        console.log('reloading objects');

        if (this.genotype.cnvMetrics === undefined) {
          this.genotype.cnvMetrics = new CnvMetrics();
        }

        if (this.genotype.polyTTract === undefined) {
          this.genotype.polyTTract = new PolyTTract();
        }

        if (this.genotype.foundMutations !== undefined) {
          for (const foundMutation of this.genotype.foundMutations) {
            foundMutationList.push(FoundMutation.fromObject(foundMutation));
          }
        }

        if (this.genotype.cnvs !== undefined) {
          for (const cnv of this.genotype.cnvs) {
            cnvList.push(CnvRequest.fromObject(cnv));
          }
          this.genotype.cnvs = cnvList;
        }

        if (this.genotype.uncoveredMutations !== undefined) {
          for (const uncovered of this.genotype.uncoveredMutations) {
            uncoveredList.push(UncoveredMutation.fromObject(uncovered));
          }
        }

        if (this.genotype.risks !== undefined) {
          for (const risk of this.genotype.risks) {
            riskList.push(StudiedMutation.fromObject(risk));
          }
        }

        try {
          if (this.genotype.noNgsMutations !== undefined) {
            for (const noNgsMutation of this.genotype.noNgsMutations) {
              noNgsMutationList.push(NoNgsMutation.fromObject(noNgsMutation));
            }
          }
        } catch (e) { console.log('Error getting noNgsMutation list, continuing'); }


        if (this.editingRequest.country.translations !== undefined) {
          for (const translation of this.editingRequest.country.translations) {
            if (translation.language.toLowerCase() === environment.langES.toLowerCase()) {
              this.editingRequest.country.viewTranslation = translation.name;
              this.countryControl.patchValue(this.editingRequest.country);
            }
          }
        }

        if (this.editingRequest.ethnicity.translations !== undefined) {
          for (const translation of this.editingRequest.ethnicity.translations) {
            if (translation.language.toLowerCase() === environment.langES.toLowerCase()) {
              this.editingRequest.ethnicity.viewTranslation = translation.name;
              this.ethnicityControl.patchValue(this.editingRequest.ethnicity);
            }
          }
        }

        for (const ethnicity of this.ethnicities) {
          for (const translation of ethnicity.translations) {
            if (translation.language.toLowerCase() === environment.langES.toLowerCase()) {
              ethnicity.viewTranslation = translation.name;
              ethnicityList.push(ethnicityElement.fromObject(ethnicity));
            } else {
              ethnicity.viewTranslation = '';
            }
          }
        }

        for (const country of this.countries) {
          for (const translation of country.translations) {
            if (translation.language.toLowerCase() === environment.langES.toLowerCase()) {
              country.viewTranslation = translation.name;
              countryList.push(countryElement.fromObject(country));
            }
          }
        }

        this.countries.sort((a, b) => a.viewTranslation.localeCompare(b.viewTranslation));
        this.ethnicities.sort((a, b) => a.viewTranslation.localeCompare(b.viewTranslation));

        this.genotype.foundMutations = foundMutationList;
        this.genotype.noNgsMutations = noNgsMutationList;
        this.countries = countryList;
        this.ethnicities = ethnicityList;

        this.individualTypes = [
          this.editingRequest.typeIndividualSinglePerson,
          this.editingRequest.typeIndividualCouple,
          this.editingRequest.typeIndividualDonor,
          this.editingRequest.typeIndividualRecipient
        ];

        console.log('starting form controls');

        this.individualTypeFormControl.patchValue(this.editingRequest.typeIndividual);

        this.countriesFiltered = this.countryControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.type),
                map(type => type ? this.filterCountries(type) : this.countries.slice())
            );

        this.ethnicitiesFiltered = this.ethnicityControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.type),
                map(type => type ? this.filterEthnicities(type) : this.ethnicities.slice())
            );
      });

    }).add(() => {
      console.log('Add started');
      this.showRecord = true;
      this.copyRequestValues(request, this.editingRequest);

      this.processListRequestsPartner();
    });
  }

  saveModelChanges(updatedRequest: Request): void {
    console.log(updatedRequest.birthday);

    for (const request of this.requests) {
      console.log('Comparing requests:' + request.urCode + 'with' + updatedRequest.urCode);
      if (updatedRequest.urCode === request.urCode) {
        this.copyRequestValues(updatedRequest, request);
        break;
      }
    }

    this.showNotification('common-elements.messages.data-saved');
  }

  showNotification(message: string): void {
    this.notificationMessage.openFromComponent(NotificationComponent, {
      data: message,
      panelClass: ['mat-toolbar', 'mat-primary'],
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  backButton(): void {
    if (this.requestFilterEvent !== undefined && this.requestFilterEvent !== null) {
      console.log('Refiltering groups with: ' + this.requestFilterEvent);
      this.sortRequests(this.requestFilterEvent);
    }

    this.showRecord = false;
    this.unlockFields = false;
    this.adding = false;
  }

  editButton(): void {
    this.unlockFields = true;

    this.countryControl.enable();
    this.ethnicityControl.enable();
    this.partnerControl.enable();
    this.individualTypeFormControl.enable();
    this.birthdayControl.enable();
    this.startDateControl.enable();
    this.endDateControl.enable();
  }

  recordButton(): void {
    this.unlockFields = false;

    this.countryControl.disable();
    this.ethnicityControl.disable();
    this.partnerControl.disable();
    this.individualTypeFormControl.disable();
    this.birthdayControl.disable();
    this.startDateControl.disable();
    this.endDateControl.disable();
  }

  saveRequest(updatedRequest: Request): void {
    try {
      if (this.addRequestSubscription !== undefined) {
        this.addRequestSubscription.unsubscribe();
      }

      console.log('Updating request');
      if (this.birthdayControl !== undefined) {
        if (this.birthdayControl.value !== undefined && this.birthdayControl.value !== null) {
          updatedRequest.birthday = new Date(this.birthdayControl.value.toString()).toISOString();
        }
      }

      if (this.startDateControl !== undefined) {
        if (this.startDateControl.value !== undefined && this.startDateControl.value !== null) {
          updatedRequest.startDate = new Date(this.startDateControl.value.toString()).toISOString();
        }
      }

      if (this.endDateControl !== undefined) {
        if (this.endDateControl.value !== undefined && this.endDateControl.value !== null) {
          updatedRequest.endDate = new Date(this.endDateControl.value.toString()).toISOString();
        }
      }

      if (this.adding) {
        // GET FORM CONTROLS
        console.log('Request screen - creating Request');
        console.log('code: ' + updatedRequest.urCode);
        console.log('active: ' + updatedRequest.active);
        console.log('groupCode: ' + updatedRequest.groupCode);
        console.log('country selected: ' + updatedRequest.country);
        console.log('ethnicity selected: ' + updatedRequest.ethnicity);
        console.log('typeIndividualSelected: ' + updatedRequest.typeIndividual);

        this.addRequestSubscription = this.requestService.createRequest(updatedRequest).subscribe(
            (createdRequest) => {
              this.editingRequest = createdRequest as Request;
              this.showNotification('request-screen.messages.request-added');
            },
            error => {
              console.log('Error caught: ' + error);
              this.showNotification('request-screen.messages.request-not-saved');
            }
        );
      } else if (this.showRecord) {
        // GET FORM CONTROL
        console.log('Request screen - creating Request');
        console.log('code: ' + updatedRequest.urCode);
        console.log('active: ' + updatedRequest.active);
        console.log('groupCode: ' + updatedRequest.groupCode);

        this.addRequestSubscription = this.requestService.updateRequest(updatedRequest).subscribe(
            (createdRequest) => {
              this.editingRequest = createdRequest as Request;
              this.showNotification('request-screen.messages.request-added');
            },
            error => {
              console.log('Error caught: ' + error);
              this.showNotification('request-screen.messages.request-not-saved');
            }
        );
      } else {
        console.log('Request screen - toggling activation of Request');
        console.log('code: ' + updatedRequest.urCode);
        console.log('active: ' + updatedRequest.active);
        console.log('groupCode: ' + updatedRequest.groupCode);

        this.addRequestSubscription = this.requestService.updateRequest(updatedRequest).subscribe(
          (createdRequest) => {
            this.editingRequest = createdRequest as Request;
            if (this.togglingActivation) {
              if (updatedRequest.active) {
                this.showNotification('request-screen.messages.request-activated');
              } else {
                this.showNotification('request-screen.messages.request-deactivated');
              }
              this.togglingActivation = false;
            }

            if (this.togglingBlock) {
              if (updatedRequest.blocked) {
                this.showNotification('request-screen.messages.request-blocked');
              } else {
                this.showNotification('request-screen.messages.request-unblocked');
              }
              this.togglingBlock = false;
            }

            if (this.togglingValidated) {
              if (updatedRequest.validated) {
                this.showNotification('request-screen.messages.request-validated');
              } else {
                this.showNotification('request-screen.messages.request-unvalidated');
              }
              this.togglingValidated = false;
            }
          },
          error => {
            console.log('Error caught: ' + error);

            if (this.togglingActivation) {
              if (updatedRequest.active) {
                this.showNotification('request-screen.messages.request-not-activated');
              } else {
                this.showNotification('request-screen.messages.request-not-deactivated');
              }
              this.togglingActivation = false;
            }

            if (this.togglingBlock) {
              if (updatedRequest.blocked) {
                this.showNotification('request-screen.messages.request-not-blocked');
              } else {
                this.showNotification('request-screen.messages.request-not-unblocked');
              }
              this.togglingBlock = false;
            }

            if (this.togglingValidated) {
              if (updatedRequest.validated) {
                this.showNotification('request-screen.messages.request-not-validated');
              } else {
                this.showNotification('request-screen.messages.request-not-unvalidated');
              }
              this.togglingValidated = false;
            }
          }
        );
      }

    } catch (e) {
      console.log(e);
      this.showNotification('bank-screen.messages.bank-not-saved');
    }
  }

  selectPartner(event: any): void {
    this.partnerRequest = event as Request;

    console.log('Partner ur code: ' + this.partnerRequest.urCode);
    console.log('Request self: ' + this.editingRequest._links.self.href);
    console.log('Partner self: ' + this.partnerRequest._links.self.href);

    this.partnerSubscription = this.requestService.addPartner(this.editingRequest, this.partnerRequest).subscribe(
      () => {
        this.showNotification('request-screen.messages.partner-added');
        for (let request of this.requests) {
          if (request._links.self.href === this.editingRequest._links.self.href) {
            request = this.editingRequest;
          }
        }
      },
      error => {
        console.log('Error caught: ' + error.error.message);
        this.showNotification(error.error.message);
        this.partnerRequest = undefined;
      }
    );
  }

  removePartner(): void {
    this.partnerSubscription = this.requestService.removePartner(this.editingRequest).subscribe(
      () => {
        this.showNotification('request-screen.messages.partner-removed');
        this.partnerRequest = new Request();
        this.editingRequest.typeIndividual = this.editingRequest.typeIndividualSinglePerson;
        this.individualTypeFormControl.patchValue(this.editingRequest.typeIndividualSinglePerson);

        for (let request of this.requests) {
          if (request._links.self.href === this.editingRequest._links.self.href) {
            request = this.editingRequest;
          }
        }

        this.partnerRequest = undefined;
      },
      error => {
        console.log('Error caught: ' + error);
        this.showNotification('request-screen.messages.partner-not-removed');
      }
    );
  }

  copyRequestValues(copyFromRequest: Request, toRequest: Request): void {
    toRequest.firstName = copyFromRequest.firstName;
    toRequest.lastName = copyFromRequest.lastName;
    toRequest.idCard = copyFromRequest.idCard;
    toRequest.receptionDate = copyFromRequest.receptionDate;
    toRequest.startDate = copyFromRequest.startDate;
    toRequest.birthday = copyFromRequest.birthday;
    toRequest.chosenCounter = copyFromRequest.chosenCounter;
    toRequest.female = copyFromRequest.female;
    toRequest.extCode = copyFromRequest.extCode;
    toRequest.groupCode = copyFromRequest.groupCode;
    toRequest.urCode = copyFromRequest.urCode;
    toRequest.external = copyFromRequest.external;
    toRequest.blocked = copyFromRequest.blocked;
    toRequest.validated = copyFromRequest.validated;
    toRequest.idCode = copyFromRequest.idCode;
    toRequest.active = copyFromRequest.active;
    toRequest.typeIndividual = copyFromRequest.typeIndividual;
    toRequest.requestType = copyFromRequest.requestType;
    toRequest.endDate = copyFromRequest.endDate;
    toRequest.status = copyFromRequest.status;
    toRequest.report = copyFromRequest.report;

    toRequest.countryView = copyFromRequest.countryView;
    toRequest.ethnicityView = copyFromRequest.ethnicityView;

    toRequest.matchRequests = copyFromRequest.matchRequests;
    toRequest.matchableRequests = copyFromRequest.matchableRequests;
    toRequest.matchableBanks = copyFromRequest.matchableBanks;
    toRequest.availableDonorGroups = copyFromRequest.availableDonorGroups;
    toRequest.requestedDonorRequests = copyFromRequest.requestedDonorRequests;
    toRequest.createdDonorRequests = copyFromRequest.createdDonorRequests;
    toRequest.country = copyFromRequest.country;
    toRequest.ethnicity = copyFromRequest.ethnicity;
    toRequest.genotype = copyFromRequest.genotype;
    toRequest.gestLabreport = copyFromRequest.gestLabreport;
  }

  displayCountryList(country: Country): string {
    return country && country.viewTranslation ? country.viewTranslation : '';
  }

  displayEthnicityList(ethnicity: Ethnicity): string {
    return ethnicity && ethnicity.viewTranslation ? ethnicity.viewTranslation : '';
  }

  displayPartnerList(request: Request): string {
    return request && request.urCode ? request.urCode : '';
  }

  displayNoNgsGene(gene: Gene): string {
    return gene && gene.geneName ? gene.geneName : '';
  }

  displayNoNgsMutation(mutation: Mutation): string {
    return mutation && mutation.hgvs ? mutation.hgvs : '';
  }

  displayNoNgsDisease(disease: Disease): string {
    return disease && disease.nameView ? disease.nameView : '';
  }

  filterCountries(name: string): Country[] {
    const filterValue = name.toLowerCase();
    return this.countries.filter(country => country.viewTranslation.toLowerCase().indexOf(filterValue) === 0);
  }

  filterEthnicities(name: string): Ethnicity[] {
    const filterValue = name.toLowerCase();
    return this.ethnicities.filter(ethnicity => ethnicity.name.toLowerCase().indexOf(filterValue) === 0);
  }

  filterGenes(name: string): Gene[] {
    const filterValue = name.toLowerCase();
    return this.genes.filter(gene => gene.geneName.toLowerCase().indexOf(filterValue) === 0);
  }

  filterDiseases(name: string): Disease[] {
    const filterValue = name.toLowerCase();
    return this.diseases.filter(disease => disease.omim.toLowerCase().indexOf(filterValue) === 0);
  }

  filterMutations(name: string): Mutation[] {
    const filterValue = name.toLowerCase();
    return this.mutations.filter(mutation => mutation.accession.toLowerCase().indexOf(filterValue) === 0);
  }

  observeLanguageChanges(): void {
    this.ethnicityLanguageSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log('Request screen component - Ethnicity option language change: ' + event.lang);

      console.log('Value control ' + this.ethnicityControl.value);

      let formTranslation = false;

      for (const ethnicity of this.ethnicities) {
        for (const translation of ethnicity.translations) {
          if (this.ethnicityControl.value !== undefined && this.ethnicityControl.value !== null) {
            if (translation.name === this.ethnicityControl.value) {
              formTranslation = true;
            }
          }

          if (translation.language.toLowerCase() === event.lang.toLowerCase()) {
            ethnicity.viewTranslation = translation.name;
            if (formTranslation) {
              console.log('patching value of ethnicity selection: ' + translation.name);
              this.ethnicityControl.patchValue(ethnicity);
              formTranslation = false;
            }
          }
        }
      }

      this.ethnicities.sort((a, b) => a.viewTranslation.localeCompare(b.viewTranslation));
    });

    this.countryLanguageSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log('Request screen component - Country option language change: ' + event.lang);

      console.log('Value control ' + this.countryControl.value);

      let formTranslation = false;

      for (const country of this.countries) {
        for (const translation of country.translations) {
          if (this.countryControl.value !== undefined && this.countryControl.value !== null) {
            if (translation.name === this.countryControl.value) {
              formTranslation = true;
            }
          }

          if (translation.language.toLowerCase() === event.lang.toLowerCase()) {
            country.viewTranslation = translation.name;
            console.log('Setting translationView: ' + country.viewTranslation);
            if (formTranslation) {
              console.log('patching value of country selection: ' + translation.name);
              this.countryControl.patchValue(country);
              formTranslation = false;
            }
          }
        }
      }

      this.countries.sort((a, b) => a.viewTranslation.localeCompare(b.viewTranslation));
    });
  }

  toggleTableField(event: any): void {
    const dialogData = new ConfirmDialogModel(
        'request-screen.messages.request-confirmation-title',
        'request-screen.messages.request-modification-confirmation',
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
        console.log(event[1] as Request);

        const columnName = event[0] as string;
        const toggledRequest = event[1] as Request;

        if (columnName === 'active') {
          this.togglingActivation = true;
          for (const request of this.requests) {
            if (toggledRequest.urCode === request.urCode) {
              console.log('Found request to toggle in request list');
              request.active = !request.active;
              this.saveRequest(request);
            }
          }
        }

        if (columnName === 'blocked') {
          this.togglingBlock = true;
          for (const request of this.requests) {
            if (toggledRequest.urCode === request.urCode) {
              console.log('Found request to toggle in request list');
              request.blocked = !request.blocked;
              this.saveRequest(request);
            }
          }
        }

        if (columnName === 'validated') {
          this.togglingValidated = true;
          for (const request of this.requests) {
            if (toggledRequest.urCode === request.urCode) {
              console.log('Found request to toggle in request list');
              request.validated = !request.validated;
              this.saveRequest(request);
            }
          }
        }
      }
    });
  }

  toggleIndividualType(event: any): void {
    console.log('changed individual type : ' + event.value);

    if (event.value === this.editingRequest.typeIndividualDonor) {
      this.editingRequest.typeIndividual = this.editingRequest.typeIndividualDonor;
    } else if (event.value === this.editingRequest.typeIndividualRecipient) {
      this.editingRequest.typeIndividual = this.editingRequest.typeIndividualRecipient;
    } else if (event.value === this.editingRequest.typeIndividualCouple) {
      this.loadPartnerData();
      this.editingRequest.typeIndividual = this.editingRequest.typeIndividualCouple;
    } else if (event.value === this.editingRequest.typeIndividualSinglePerson) {
      this.editingRequest.typeIndividual = this.editingRequest.typeIndividualSinglePerson;
    }
  }

  loadFoundMutationTable(): void {
    this.foundMutationColumns = new Array<TableColumn>();

    const tableColumnFoundMutationChromosome: TableColumn = {
      name: 'request-screen.found-mutation-chromosome-column',
      dataKey: 'chromosome',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundMutationGeneName: TableColumn = {
      name: 'request-screen.found-mutation-gene-name-column',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundMutationExonNumber: TableColumn = {
      name: 'request-screen.found-mutation-exon-number-column',
      dataKey: 'exonNumber',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundMutationIntronNumber: TableColumn = {
      name: 'request-screen.found-mutation-intron-number-column',
      dataKey: 'intronNumber',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundMutationHgvs: TableColumn = {
      name: 'request-screen.found-mutation-hgvs-column',
      dataKey: 'hgvs',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundMutationType: TableColumn = {
      name: 'request-screen.found-mutation-mutation-type-column',
      dataKey: 'mutationType',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundMutationTranscript: TableColumn = {
      name: 'request-screen.found-mutation-transcript-column',
      dataKey: 'transcript',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundMutationReferences: TableColumn = {
      name: 'request-screen.found-mutation-references-column',
      dataKey: 'references',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundType: TableColumn = {
      name: 'request-screen.found-mutation-type-column',
      dataKey: 'type',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundTag: TableColumn = {
      name: 'request-screen.found-mutation-tag-column',
      dataKey: 'tag',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundCategory: TableColumn = {
      name: 'request-screen.found-mutation-category-column',
      dataKey: 'category',
      position: 'left',
      isSortable: true
    };

    const tableColumnFoundActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    // this.foundMutationColumns.push(tableColumnFoundMutationId);
    this.foundMutationColumns.push(tableColumnFoundMutationChromosome);
    this.foundMutationColumns.push(tableColumnFoundMutationGeneName);
    this.foundMutationColumns.push(tableColumnFoundMutationExonNumber);
    this.foundMutationColumns.push(tableColumnFoundMutationIntronNumber);
    this.foundMutationColumns.push(tableColumnFoundMutationHgvs);
    this.foundMutationColumns.push(tableColumnFoundMutationType);
    this.foundMutationColumns.push(tableColumnFoundMutationTranscript);
    this.foundMutationColumns.push(tableColumnFoundMutationReferences);
    this.foundMutationColumns.push(tableColumnFoundType);
    this.foundMutationColumns.push(tableColumnFoundTag);
    this.foundMutationColumns.push(tableColumnFoundCategory);
    this.foundMutationColumns.push(tableColumnFoundActions);
  }

  // REQUEST LIST
  sortRequests(event: any): void {
    this.pagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
      this.pagination.sortField = event.active;
      this.pagination.sortOrder = event.direction;
    }
    this.processListRequests();
  }

  textFiltered(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.textFilter = event.target.value;
      this.pagination.currentPag = 0;
      this.pagination.textField = event.field;
    }
    this.processListRequests();
  }

  pageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.totalElements = event.length;
      this.pagination.currentPag = event.pageIndex;
      this.pagination.currentPagSize = event.pageSize;
    }
    this.processListRequests();
  }

  processListRequests(): void {
    if (this.pagination.textFilter === null || this.pagination.textFilter === '') {
      let requestArray = Array<Request>();
      const obs = this.requestService.listRequestsPagination(this.pagination);
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
              this.requestsPartner = requestArray;
              this.loading = false;
            }
            if (response.page !== undefined) {
              this.pagination.currentPag = response.page.number;
              this.pagination.numberOfPages = response.page.totalPages;
              this.pagination.totalElements = response.page.totalElements;
            }
          },
          error => {
            this.showNotification(error);
          });
      }
    } else {
      let parameter: string;

      if (this.pagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ur-code').toLowerCase()) {
        parameter = 'urCode';
      } else if (this.pagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ext-code').toLowerCase()) {
        parameter = 'extCode';
      } else if (this.pagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-first-name').toLowerCase()) {
        parameter = 'firstName';
      } else if (this.pagination.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-last-name').toLowerCase()) {
        parameter = 'lastName';
      }

      this.requestService.getRequestByParameter(this.pagination, parameter).subscribe(data => {
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
        },
        error => {
          this.showNotification(error);
        });
    }
  }

  // PARTNER REQUEST
  filterPartnerRequests(name: string): Request[] {
    const filterValue = name.toLowerCase();
    return this.partnerRequests.filter(mutation => mutation.urCode.toLowerCase().indexOf(filterValue) === 0);
  }

  textFilteredPartnerRequest(event): void {
    if (event !== null && event !== undefined) {
      this.paginationPartnerRequests.textFilter = event.target.value;
      this.paginationPartnerRequests.currentPag = 0;
      this.paginationPartnerRequests.textField = event.field;
    }
    this.processListRequestsPartner();
  }

  pageChangedPartnerRequest(event): void {
    if (event !== null && event !== undefined) {
      this.paginationPartnerRequests.totalElements = event.length;
      this.paginationPartnerRequests.currentPag = event.pageIndex;
      this.paginationPartnerRequests.currentPagSize = event.pageSize;
    }
    this.processListRequestsPartner();
  }

  processListRequestsPartner(): void {
    if (this.paginationPartnerRequests.textFilter === null || this.paginationPartnerRequests.textFilter === '') {
      let requestArray;
      const obs = this.requestService.listRequestsPagination(this.paginationPartnerRequests);
      if (obs !== null && obs !== undefined) {
        if (this.requestsSubscription !== undefined) {
          this.requestsSubscription.unsubscribe();
        }
        this.requestsSubscription = obs.subscribe(
          response => {
            const halObject = response as HalObject;

            if (halObject._embedded !== undefined) {
              requestArray = new Array<Request>();
              halObject._embedded[environment.linksRequests].forEach(element => {
                const request: Request = Request.fromObject(element);
                requestArray.push(request);
              });
              this.requestsPartner = requestArray;
              console.log('LOADED PARTNER REQUESTS: ' + this.requestsPartner.length);
              this.loading = false;
            }
            if (response.page !== undefined) {
              this.paginationPartnerRequests.currentPag = response.page.number;
              this.paginationPartnerRequests.numberOfPages = response.page.totalPages;
              this.paginationPartnerRequests.totalElements = response.page.totalElements;
            }
          },
          error => {
            this.showNotification(error);
          });
      }
    } else {
      let parameter: string;

      if (this.paginationPartnerRequests.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ur-code').toLowerCase()) {
        parameter = 'urCode';
      } else if (this.paginationPartnerRequests.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-ext-code').toLowerCase()) {
        parameter = 'extCode';
      } else if (this.paginationPartnerRequests.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-first-name').toLowerCase()) {
        parameter = 'firstName';
      } else if (this.paginationPartnerRequests.textField.toLowerCase() ===
        this.translateService.instant('request-screen.search-fields.request-last-name').toLowerCase()) {
        parameter = 'lastName';
      }

      this.requestService.getRequestByParameter(this.paginationPartnerRequests, parameter).subscribe(data => {
          const requestAux: Array<Request> = new Array<Request>();
          if (data._embedded !== null
            && data._embedded !== undefined
            && data._embedded[environment.linksRequests] !== null
            && data._embedded[environment.linksRequests] !== undefined) {
            data._embedded[environment.linksRequests].forEach(element => {
              requestAux.push(Request.fromObject(element));
            });
          }
          this.requestsPartner = requestAux;
          console.log('LOADED PARTNER REQUESTS: ' + this.requestsPartner.length);
          this.loading = false;
        },
        error => {
          this.showNotification(error);
        });
    }
  }

  // MATCH REQUESTS
  processMatchRequests(): void {
    console.log('MATCHES TESTING');

    if (this.matchRequestSubscription !== undefined) {
      this.matchRequestSubscription.unsubscribe();
    }

    if (this.editingRequest._links['precon:match-requests'] !== undefined &&
        this.editingRequest._links['precon:match-requests'].href !== undefined) {
      this.matchRequestSubscription = this.requestService.getRequestMatches(this.editingRequest).subscribe(data => {
        const hal = data as HalObject;

        console.log('TESTING MATCH REQUESTS: ' + hal._embedded[environment.linksMatchRequests]);

        const matchesAux: Array<MatchRequest> = new Array<MatchRequest>();
        if (hal._embedded !== null
          && hal._embedded !== undefined
          && hal._embedded[environment.linksMatchRequests] !== null
          && hal._embedded[environment.linksMatchRequests] !== undefined) {
          hal._embedded[environment.linksMatchRequests].forEach(element => {
            if (this.matchRequestReportSubscription !== undefined) {
              this.matchRequestReportSubscription.unsubscribe();
            }

            const matchRequest = MatchRequest.fromObject(element);
            if (matchRequest._links['precon:report'] !== undefined) {
              if (matchRequest._links['precon:report'].href !== undefined) {
                this.matchRequestReportSubscription = this.requestService.getMatchRequestReport(matchRequest).subscribe(reportData => {
                  matchRequest.report = reportData as string;
                });
              }
            }

            matchesAux.push(matchRequest);
          });
        }
        if (hal.page !== undefined) {
          this.paginationMatchRequests.currentPag = hal.page.number;
          this.paginationMatchRequests.numberOfPages = hal.page.totalPages;
          this.paginationMatchRequests.totalElements = hal.page.totalElements;
        }

        this.matchRequests = matchesAux;

        if (this.matchRequests === undefined) {
          this.matchRequests = new Array<MatchRequest>();
        }
      });
    }
  }

  loadMatchRequestTable(): void {
    this.matchRequestColumns = new Array<TableColumn>();

    const columnGroupCode: TableColumn = {
      name: 'request-screen.match-request-group-column',
      dataKey: 'groupCode',
      position: 'left',
      isSortable: true
    };

    const columnMatchVersion: TableColumn = {
      name: 'request-screen.match-request-match-version-column',
      dataKey: 'matchVersion',
      position: 'left',
      isSortable: true
    };

    const columnUser: TableColumn = {
      name: 'request-screen.match-request-launch-user-column',
      dataKey: 'launchUser',
      position: 'left',
      isSortable: true
    };

    const columnRequestDate: TableColumn = {
      name: 'request-screen.match-request-request-date-column',
      dataKey: 'matchRequestDate',
      position: 'left',
      isSortable: true
    };

    const columnExecutionDate: TableColumn = {
      name: 'request-screen.match-request-execution-date-column',
      dataKey: 'matchExecutionDate',
      position: 'left',
      isSortable: true
    };

    const columnStatus: TableColumn = {
      name: 'request-screen.match-request-status-column',
      dataKey: 'state',
      position: 'left',
      isSortable: true
    };

    const columnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.matchRequestColumns.push(columnGroupCode);
    this.matchRequestColumns.push(columnMatchVersion);
    this.matchRequestColumns.push(columnUser);
    this.matchRequestColumns.push(columnRequestDate);
    this.matchRequestColumns.push(columnExecutionDate);
    this.matchRequestColumns.push(columnStatus);
    this.matchRequestColumns.push(columnActions);

    this.processMatchRequests();
  }

  // NGS MUTATIONS

  // risksColumns: Array<TableColumn>;
  // uncoveredsColumns: Array<TableColumn>;

  // RISKS
  loadRisksTable(): void {
    this.risksColumns = new Array<TableColumn>();

    const geneName: TableColumn = {
      name: 'request-screen.risks-gene-name',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };

    const residualRisk: TableColumn = {
      name: 'request-screen.risks-residual-risk',
      dataKey: 'carrierRate',
      position: 'left',
      isSortable: true
    };

    const ethnicityTranslations: TableColumn = {
      name: 'request-screen.risks-ethnicity',
      dataKey: 'ethnicityTranslations',
      position: 'left',
      isSortable: true
    };

    const diseaseOmim: TableColumn = {
      name: 'request-screen.risks-disease-omim',
      dataKey: 'diseaseOmim',
      position: 'left',
      isSortable: true
    };

    const diseaseTranslation: TableColumn = {
      name: 'request-screen.risks-disease-translation',
      dataKey: 'diseaseTranslation',
      position: 'left',
      isSortable: true
    };

    this.risksColumns.push(geneName);
    this.risksColumns.push(residualRisk);
    this.risksColumns.push(ethnicityTranslations);
    this.risksColumns.push(diseaseOmim);
    this.risksColumns.push(diseaseTranslation);
  }

  // UNCOVEREDS

  // NO NGS MUTATIONS
  addNoNgsMutation(): void {
    console.log('Request screen - adding no NGS mutation');

    this.editingNoNgsMutation.geneName = this.noNgsGeneFormControl.value.geneName;
    this.editingNoNgsMutation.diseaseName = this.noNgsDiseaseFormControl.value.omim;
    this.editingNoNgsMutation.mutation = this.noNgsMutationFormControl.value.accession;

    console.log('No NGS mutation: ' + this.editingNoNgsMutation.mutation);
    console.log('No NGS disease name: ' + this.editingNoNgsMutation.diseaseName);
    console.log('No NGS gene name: ' + this.editingNoNgsMutation.geneName);
    console.log('No NGS gene region: ' + this.editingNoNgsMutation.geneRegion);

    this.noNgsMutationService.createNoNgsMutationInRequest(this.editingNoNgsMutation, this.editingRequest);
  }

  deleteNoNgsMutation(noNgsMutationToDelete: NoNgsMutation): void {
    const dialogData = new ConfirmDialogModel(
      'request-screen.messages.request-confirmation-title',
      'request-screen.messages.request-no-ngs-deletion-confirmation',
      'common-elements.messages.confirmation-dialog-accept',
      'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogResult = dialogResult as boolean;

      if (dialogResult) {
        for (const noNgsMutation of this.genotype.noNgsMutations) {
          if (noNgsMutationToDelete._links.self.href === noNgsMutation._links.self.href) {
            try {
              this.deleteNoNgsMutationSubscription = this.noNgsMutationService.deleteNoNgsMutationInRequest(noNgsMutation).subscribe(
                () => {
                  this.genotype.noNgsMutations = this.genotype.noNgsMutations.filter(
                    noNgsMutationFiltered => (noNgsMutation._links.self.href !== noNgsMutationFiltered._links.self.href)
                  );

                  this.showNotification('request-screen.messages.no-ngs-deleted');
                },
                error => {
                  console.log('Error caught: ' + error);
                  this.showNotification(error);
                }
              );
            } catch (e) {
              console.log('');
              this.showNotification('group-screen.messages.permission-not-saved');
            }
          }
        }
      }
    });
  }

  loadNoNgsMutationTable(): void {
    this.noNgsMutationColumns = new Array<TableColumn>();

    const tableColumnNoNgsDiseaseName: TableColumn = {
      name: 'request-screen.no-ngs-mutation-disease-name-column',
      dataKey: 'diseaseName',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsOmim: TableColumn = {
      name: 'request-screen.no-ngs-mutation-omim-column',
      dataKey: 'omim',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsChromosome: TableColumn = {
      name: 'request-screen.no-ngs-mutation-chromosome-column',
      dataKey: 'chromosome',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsGeneName: TableColumn = {
      name: 'request-screen.no-ngs-mutation-gene-name-column',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsGeneRegion: TableColumn = {
      name: 'request-screen.no-ngs-mutation-gene-region-column',
      dataKey: 'geneRegion',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsMutationName: TableColumn = {
      name: 'request-screen.no-ngs-mutation-name-column',
      dataKey: 'mutation',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsMutationExpansion: TableColumn = {
      name: 'request-screen.no-ngs-mutation-expansion-column',
      dataKey: 'expansion',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsMutationType: TableColumn = {
      name: 'request-screen.no-ngs-mutation-type-column',
      dataKey: 'mutationType',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsMutationSequence: TableColumn = {
      name: 'request-screen.no-ngs-mutation-ref-sequence-column',
      dataKey: 'refSequence',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsMutationReferences: TableColumn = {
      name: 'request-screen.no-ngs-mutation-references-column',
      dataKey: 'references',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsMutationAgg: TableColumn = {
      name: 'request-screen.no-ngs-mutation-agg-column',
      dataKey: 'agg',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsMutationPercentage: TableColumn = {
      name: 'request-screen.no-ngs-mutation-percentage-column',
      dataKey: 'percentage',
      position: 'left',
      isSortable: true
    };

    const tableColumnNoNgsActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.noNgsMutationColumns.push(tableColumnNoNgsDiseaseName);
    this.noNgsMutationColumns.push(tableColumnNoNgsOmim);
    this.noNgsMutationColumns.push(tableColumnNoNgsChromosome);
    this.noNgsMutationColumns.push(tableColumnNoNgsGeneName);
    this.noNgsMutationColumns.push(tableColumnNoNgsGeneRegion);
    this.noNgsMutationColumns.push(tableColumnNoNgsMutationName);
    this.noNgsMutationColumns.push(tableColumnNoNgsMutationType);
    this.noNgsMutationColumns.push(tableColumnNoNgsMutationExpansion);
    this.noNgsMutationColumns.push(tableColumnNoNgsMutationAgg);
    this.noNgsMutationColumns.push(tableColumnNoNgsMutationPercentage);
    this.noNgsMutationColumns.push(tableColumnNoNgsMutationSequence);
    this.noNgsMutationColumns.push(tableColumnNoNgsMutationReferences);
    this.noNgsMutationColumns.push(tableColumnNoNgsActions);
  }

  // CNVs
  loadCnvTable(): void {
    this.cnvColumns = new Array<TableColumn>();

    const tableColumnCnvCopyNumber: TableColumn = {
      name: 'request-screen.cnv-copy-number-column',
      dataKey: 'copyNumber',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvMeanCoverage: TableColumn = {
      name: 'request-screen.cnv-mean-coverage-column',
      dataKey: 'meanCoverage',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvLogRatio: TableColumn = {
      name: 'request-screen.cnv-log-ratio-column',
      dataKey: 'logRatio',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvTag: TableColumn = {
      name: 'request-screen.cnv-tag-column',
      dataKey: 'tag',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvGeneName: TableColumn = {
      name: 'request-screen.cnv-gene-name-column',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvPanelVersion: TableColumn = {
      name: 'request-screen.cnv-panel-version-column',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvLocation: TableColumn = {
      name: 'request-screen.cnv-location-column',
      dataKey: 'location',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvTranscript: TableColumn = {
      name: 'request-screen.cnv-transcript-column',
      dataKey: 'transcript',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvExonNumber: TableColumn = {
      name: 'request-screen.cnv-exon-number-column',
      dataKey: 'exonNumber',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvChromosome: TableColumn = {
      name: 'request-screen.cnv-chromosome-column',
      dataKey: 'chromosome',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvStartPosition: TableColumn = {
      name: 'request-screen.cnv-start-position-column',
      dataKey: 'startPos',
      position: 'left',
      isSortable: true
    };

    const tableColumnCnvEndPosition: TableColumn = {
      name: 'request-screen.cnv-end-position-column',
      dataKey: 'endPos',
      position: 'left',
      isSortable: true
    };

    // this.cnvColumns.push(tableColumnCnvActive);
    // this.cnvColumns.push(tableColumnCnvPositive);
    this.cnvColumns.push(tableColumnCnvCopyNumber);
    this.cnvColumns.push(tableColumnCnvMeanCoverage);
    this.cnvColumns.push(tableColumnCnvLogRatio);
    this.cnvColumns.push(tableColumnCnvTag);
    this.cnvColumns.push(tableColumnCnvGeneName);
    this.cnvColumns.push(tableColumnCnvPanelVersion);
    this.cnvColumns.push(tableColumnCnvLocation);
    this.cnvColumns.push(tableColumnCnvTranscript);
    this.cnvColumns.push(tableColumnCnvExonNumber);
    this.cnvColumns.push(tableColumnCnvChromosome);
    this.cnvColumns.push(tableColumnCnvStartPosition);
    this.cnvColumns.push(tableColumnCnvEndPosition);
  }
  // CNV METRICS

  // POLY

  exportData(request: Request): void {
    this.excelService.generateExcel(request.urCode);
  }

  generateIndividualReport(request: Request): void {
    const requestor = new Requestor();
    requestor.request = request;

    this.reportDialogRef = this.dialog.open(ReportComponent, {
      width: '1600px',
      data: {
        mode: 'individual',
        info: requestor
      }
    });
  }

  generateCoupleReport(request: Request): void {
    const requestor = new Requestor();
    requestor.request = request;

    this.reportDialogRef = this.dialog.open(ReportComponent, {
      width: '1600px',
      data: {
        mode: 'couple',
        info: requestor
      }
    });
  }

  generateOneDonorReport(request: Request) {
    const requestor = new Requestor();
    requestor.request = request;

    this.reportDialogRef = this.dialog.open(ReportComponent, {
      width: '1600px',
      data: {
        mode: 'oneDonor',
        info: requestor
      }
    });
  }

  downloadIndividualReport(request: Request): void {
    if (request._links['precon:individual-report-status'] !== undefined) {
      if (request._links['precon:individual-report-status'].href !== undefined) {
        this.individualReportSubscription = this.requestService.getIndividualReport(request).subscribe( reportStatusData => {
          const reportStatus = reportStatusData as IndividualReportStatus;

          if (reportStatus._links['precon:download'] !== undefined) {
            if (reportStatus._links['precon:download'].href !== undefined) {
              this.downloadReportSubscription = this.requestService.downloadReport(reportStatus._links['precon:download'].href).subscribe(downloadData => {
                console.log('Downloading match report');
                const file = new Blob([downloadData as string], {type: 'text/plain'});
                FileSaver.saveAs(file, this.editingRequest.urCode + ".pdf");
              });
            } else {
              this.showNotification('request-screen.messages.no-report');
            }
          } else {
            this.showNotification('request-screen.messages.no-report');
          }
        });
      } else {
        this.showNotification('request-screen.messages.no-report');
      }
    } else {
      this.showNotification('request-screen.messages.no-report');
    }
  }

  downloadCoupleReport(request: Request): void {
    this.coupleReportSubscription = this.requestService.getCoupleReport(request).subscribe( reportStatusData => {
      const reportStatus = reportStatusData as CoupleMatchReportStatus;

      if (reportStatus._links['precon:download'] !== undefined) {
        if (reportStatus._links['precon:download'].href !== undefined) {
          this.downloadReportSubscription = this.requestService.downloadReport(reportStatus._links['precon:download'].href).subscribe(downloadData => {
            console.log('Downloading match report');
            const file = new Blob([downloadData as string], {type: 'text/plain'});
            FileSaver.saveAs(file, this.editingRequest.urCode + ".pdf");
          });
        } else {
          this.showNotification('request-screen.messages.no-report');
        }
      } else {
        this.showNotification('request-screen.messages.no-report');
      }
    });
  }

  downloadSomeDonorReport(request: Request) {
    this.donorReportSubscription = this.requestService.getDonorReport(request).subscribe( reportStatusData => {
      const reportStatus = reportStatusData as SomeDonorsReportStatus;

      if (reportStatus._links['precon:download'] !== undefined) {
        if (reportStatus._links['precon:download'].href !== undefined) {
          this.downloadReportSubscription = this.requestService.downloadReport(reportStatus._links['precon:download'].href).subscribe(downloadData => {
            console.log('Downloading match report');
            const file = new Blob([downloadData as string], {type: 'text/plain'});
            FileSaver.saveAs(file, this.editingRequest.urCode + ".pdf");
          });
        } else {
          this.showNotification('request-screen.messages.no-report');
        }
      } else {
        this.showNotification('request-screen.messages.no-report');
      }
    });
  }

  downloadMatchReport(matchRequest: MatchRequest): void {
    console.log('Downloading match report');
    if (matchRequest.report !== undefined) {
      const file = new Blob([matchRequest.report], {type: 'text/plain'});
      FileSaver.saveAs(file, this.editingRequest.urCode + ".pdf");
    } else {
      this.showNotification('request-screen.messages.no-match-request-report');
    }
  }

}
