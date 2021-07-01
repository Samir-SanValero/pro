import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewRequestModel } from './new-request.model';
import { Country, Ethnicity, Group, Request } from '../../../models/administrative-model';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GroupService } from '../../../services/administrative/group.service';
import { CountryService } from '../../../services/administrative/country.service';
import { EthnicityService } from '../../../services/administrative/ethnicity.service';
import { HalObject, Pagination } from '../../../models/common-model';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Gene } from '../../../models/genetic-model';
import { TableColumn } from '../../common/table/table.model';
import { TableService } from '../../../services/common/table.service';
import { GeneService } from '../../../services/genetic/gene.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit, OnDestroy {
  geneDefaultPageSizes = environment.geneTableDefaultPageSizes;
  showSecondForm: boolean;
  loading: boolean;

  geneSearchFields: Array<string>;
  groupsPagination: Pagination;

  requestDataForm: FormGroup;
  geneDataForm: FormGroup;
  genePagination: Pagination;
  geneTableColumns: Array<TableColumn>;

  request: Request;
  groups: Array<Group>;
  requestTypes: Array<string>;
  countries: Array<Country>;
  ethnicities: Array<Ethnicity>;
  genes: Gene[];

  title: string;
  message: string;
  acceptButtonText: string;
  cancelButtonText: string;

  // Subscriptions
  countrySubscription: Subscription;
  ethnicitySubscription: Subscription;
  groupSubscription: Subscription;
  geneSubscription: Subscription;

  constructor(
              public dialogRef: MatDialogRef<NewRequestComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NewRequestModel,
              public groupService: GroupService,
              public geneService: GeneService,
              public countryService: CountryService,
              public ethnicityService: EthnicityService,
              public translateService: TranslateService,
              public tableService: TableService
             ) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.acceptButtonText = data.acceptButtonText;
    this.cancelButtonText = data.cancelButtonText;
  }

  ngOnInit(): void {
    this.loading = false;
    this.showSecondForm = false;
    this.request = new Request();
    this.genePagination = new Pagination();

    this.loadForms();
    this.loadGroups();
    this.loadCountries();
    this.loadEthnicities();
    this.loadRequestTypes();
  }

  ngOnDestroy() {
    if (this.countrySubscription !== undefined) {
      this.countrySubscription.unsubscribe();
    }

    if (this.ethnicitySubscription !== undefined) {
      this.ethnicitySubscription.unsubscribe();
    }

    if (this.groupSubscription !== undefined) {
      this.groupSubscription.unsubscribe();
    }

    if (this.geneSubscription !== undefined) {
      this.geneSubscription.unsubscribe();
    }
  }

  loadForms() {
    this.requestDataForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      idCard: new FormControl(),
      clientReference: new FormControl(),
      requestType: new FormControl(),
      gender: new FormControl(),
      birthDay: new FormControl(),
      country: new FormControl(),
      ethnicity: new FormControl()
    });

    this.geneDataForm = new FormGroup({
      extCode: new FormControl(),
      externalCode: new FormControl()
    })
  }

  loadGroups() {
    this.groupsPagination = new Pagination();

    this.groupService.listGroupsPagination(this.groupsPagination).subscribe( (groupData) => {
      this.groups = groupData._embedded[environment.linksGroups] as Array<Group>;

      if (groupData.page !== undefined) {
        this.groupsPagination.currentPag = groupData.page.number;
        this.groupsPagination.numberOfPages = groupData.page.totalPages;
        this.groupsPagination.totalElements = groupData.page.totalElements;
      }
    });
  }

  loadCountries() {
    this.countrySubscription = this.countryService.listCountries().subscribe( (countryData) => {
      this.countries = countryData as Array<Country>;
      this.translateCountries();
    });
  }

  loadEthnicities() {
    this.ethnicitySubscription = this.ethnicityService.listEthnicities().subscribe( (ethnicityData) => {
      this.ethnicities = ethnicityData as Array<Ethnicity>;
      this.translateEthnicity();
    });
  }

  loadGeneTable() {
    this.genePagination = new Pagination();
    this.geneTableColumns = new Array<TableColumn>();
    this.geneSearchFields = new Array<string>();
    this.geneSearchFields.push('gene-screen.gene-name');

    const tableColumnName: TableColumn = {
      name: 'gene-screen.name-column',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };

    const tableColumnAlias: TableColumn = {
      name: 'gene-screen.alias-column',
      dataKey: 'aliases',
      position: 'left',
      isSortable: true
    };

    const tableColumnHgncId: TableColumn = {
      name: 'gene-screen.hgncid-column',
      dataKey: 'hgncId',
      position: 'left',
      isSortable: true
    };

    const tableColumnChromosome: TableColumn = {
      name: 'gene-screen.cromosome-column',
      dataKey: 'chromosome',
      position: 'left',
      isSortable: true
    };
    const tableColumnPanel: TableColumn = {
      name: 'gene-screen.gene-panel',
      dataKey: 'panel',
      position: 'left',
      isSortable: true
    };

    const tableColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.geneTableColumns.push(tableColumnName);
    this.geneTableColumns.push(tableColumnAlias);
    this.geneTableColumns.push(tableColumnHgncId);
    this.geneTableColumns.push(tableColumnChromosome);
    this.geneTableColumns.push(tableColumnPanel);
    this.geneTableColumns.push(tableColumnActions);
  }

  loadRequestTypes() {
    this.requestTypes = [
      this.request.typeIndividualSinglePerson,
      this.request.typeIndividualCouple,
      this.request.typeIndividualDonor,
      this.request.typeIndividualRecipient
    ];
  }

  genePageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.genePagination.totalElements = event.length;
      this.genePagination.currentPag = event.pageIndex;
      this.genePagination.currentPagSize = event.pageSize;
    }
    this.processListGenes();
  }

  processListGenes(): void {
    const timeout = setTimeout(() => {
      this.tableService.selectLoadingSearch(true);
    }, 1000);

    if (this.genePagination.textFilter === null || this.genePagination.textFilter === '') {
      const list = new Array<Gene>();
      const obs = this.geneService.listGenesPagination(this.genePagination);
      if (obs !== null && obs !== undefined) {
        this.geneSubscription = obs.subscribe((geneData) => {
          console.log('Gene screen - recovered genes');
          if (geneData._embedded !== undefined && geneData._embedded[environment.linksGenes] !== undefined) {
            geneData._embedded[environment.linksGenes].forEach(element => {
              list.push(Gene.fromObject(element));
            });
            this.genes = list;
            this.loading = false;
            clearTimeout(timeout);
            this.tableService.selectLoadingSearch(false);
          }
          if (geneData.page !== undefined) {
            this.genePagination.currentPag = geneData.page.number;
            this.genePagination.numberOfPages = geneData.page.totalPages;
            this.genePagination.totalElements = geneData.page.totalElements;
          }
        });
      }
    } else {
      const geneAux = new Array<Gene>();

      this.geneService.getGeneByParameter(this.genePagination, 'name').subscribe(response => {
        const halObject = response as HalObject;

        console.log(response._embedded);
        if (halObject._embedded !== null
          && halObject._embedded !== undefined
          && halObject._embedded[environment.linksGenes] !== null
          && halObject._embedded[environment.linksGenes] !== undefined) {

          halObject._embedded[environment.linksGenes].forEach(element => {
            geneAux.push(Gene.fromObject(element));
          });
        }

        if (response.page !== undefined) {
          this.genePagination.currentPag = response.page.number;
          this.genePagination.numberOfPages = response.page.totalPages;
          this.genePagination.totalElements = response.page.totalElements;
        }
        this.genes = geneAux;
        clearTimeout(timeout);
        this.tableService.selectLoadingSearch(false);
      });
    }
  }

  sortGenes(event: any): void {
    this.genePagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
      this.genePagination.sortField = event.active;
      this.genePagination.sortOrder = event.direction;
    }
    this.processListGenes();
  }

  geneTextFiltered(event): void {
    if (event !== null && event !== undefined) {
      this.genePagination.textFilter = event.target.value;
      this.genePagination.currentPag = 0;
      this.genePagination.textField = event.field;
    }
    this.processListGenes();
  }

  translateCountries() {
    let currentLanguage = this.translateService.currentLang;

    if (currentLanguage === undefined) {
      currentLanguage = 'es';
    }

    for (let country of (this.countries)) {
      if (country.translations !== undefined) {
        for (const translation of country.translations) {
          if (translation.language.toLowerCase() === currentLanguage.toLowerCase()) {
            country.viewTranslation = translation.name;
          }
        }
      }
    }
  }

  translateEthnicity() {
    let currentLanguage = this.translateService.currentLang;

    if (currentLanguage === undefined) {
      currentLanguage = 'es';
    }

    for (let ethnicity of (this.ethnicities)) {
      if (ethnicity.translations !== undefined) {
        for (const translation of ethnicity.translations) {
          if (translation.language.toLowerCase() === currentLanguage.toLowerCase()) {
            ethnicity.viewTranslation = translation.name;
          }
        }
      }
    }
  }

  next(): void {
    this.showSecondForm = true;
  }

  previous(): void {
    this.showSecondForm = false;
  }

  save(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  cancel(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
