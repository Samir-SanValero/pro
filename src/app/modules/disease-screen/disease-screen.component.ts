import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DiseaseService } from '../../services/genetic/disease.service';
import { GeneService } from '../../services/genetic/gene.service';
import { Subscription, Observable, of } from 'rxjs';
import { Disease, Gene, ApiRequest } from '../../models/genetic-model';
import { Translation } from '../../models/administrative-model';
import { TableColumn } from '../common/table/table.model';
import { NotificationComponent } from '../common/notification/notification.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TableComponent } from '../common/table/table.component';
import { HalObject, Pagination } from '../../models/common-model';
import { TableService } from '../../services/common/table.service';

@Component({
  selector: 'app-disease-screen',
  templateUrl: './disease-screen.component.html',
  styleUrls: ['./disease-screen.component.scss']
})
export class DiseaseScreenComponent implements OnInit, OnDestroy {
  defaultPageSizes = environment.cnvTableDefaultPageSizes;

  @ViewChild('languageSelect') public selectLanguage: HTMLSelectElement;
  @ViewChild('geneTable') public geneTable: TableComponent;

  editing: boolean;
  editingDisease: Disease;
  editingSelectedLanguage;
  editingSelectedLanguageIndex: number;

  // Subscriptions
  diseaseSubscription: Subscription;

  // Objects
  gene: Gene;
  genes: Gene[];
  genesFiltered: Observable<Gene[]>;
  genesUnsorted: Gene[];
  diseases: Disease[];
  diseasesUnsorted: Disease[];

  tableColumns: Array<TableColumn>;
  tableGenes: Array<TableColumn>;

  geneFormControl: FormControl;
  searchFields: Array<string>;

  pagination: Pagination;
  loading: boolean;
  unlockFields: boolean;

  constructor(
    public diseaseService: DiseaseService,
    public geneService: GeneService,
    public dialog: MatDialog,
    public notificationMessage: MatSnackBar,
    public translateService: TranslateService,
    public tableService: TableService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.tableColumns = new Array<TableColumn>();
    this.tableGenes = new Array<TableColumn>();
    this.geneFormControl = new FormControl();
    this.pagination = new Pagination();

    const tableColumnName: TableColumn = {
      name: 'disease-screen.name-column',
      dataKey: 'diseaseName',
      position: 'left',
      isSortable: true
    };

    const tableColumnOmim: TableColumn = {
      name: 'disease-screen.omim-column',
      dataKey: 'omim',
      position: 'left',
      isSortable: true
    };

    const tableColumnHereditaryPattern: TableColumn = {
      name: 'disease-screen.hereditary-column',
      dataKey: 'heredityPattern',
      position: 'left',
      isSortable: true
    };

    const tableColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.tableColumns.push(tableColumnName);
    this.tableColumns.push(tableColumnOmim);
    this.tableColumns.push(tableColumnHereditaryPattern);
    this.tableColumns.push(tableColumnActions);

    const tableColumnGeneName: TableColumn = {
      name: 'gene-screen.name-column',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };

    const tableColumnGeneAlias: TableColumn = {
      name: 'gene-screen.alias-column',
      dataKey: 'aliases',
      position: 'left',
      isSortable: true
    };

    const tableColumnGeneHgncId: TableColumn = {
      name: 'gene-screen.hgncid-column',
      dataKey: 'hgncId',
      position: 'left',
      isSortable: true
    };

    const tableColumnGeneChromosome: TableColumn = {
      name: 'gene-screen.cromosome-column',
      dataKey: 'chromosome',
      position: 'left',
      isSortable: true
   };

    const tableColumnGeneActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.tableGenes.push(tableColumnGeneName);
    this.tableGenes.push(tableColumnGeneAlias);
    this.tableGenes.push(tableColumnGeneHgncId);
    this.tableGenes.push(tableColumnGeneChromosome);
    this.tableGenes.push(tableColumnGeneActions);
    this.editingSelectedLanguageIndex = 0;
    this.searchFields = new Array<string>();
    this.searchFields.push('disease-screen.name-column');
    this.searchFields.push('disease-screen.omim-column');

    this.processListDiseases();
  }

  ngOnDestroy(): void {
    if (this.diseaseSubscription !== undefined) {
      this.diseaseSubscription.unsubscribe();
    }
  }

  processListDiseases(): void {
    const timeout = setTimeout(() => {
      this.tableService.selectLoadingSearch(true);
    }, 1000);

    if (this.pagination.textFilter === null || this.pagination.textFilter === '') {
        const obs = this.diseaseService.listDiseasePagination(this.pagination);
        if (obs !== null && obs !== undefined) {
            this.diseaseSubscription = obs.subscribe((diseaseData) => {
                if (diseaseData._embedded !== undefined) {
                    this.diseases = diseaseData._embedded[environment.linksDiseases] as Array<Disease>;
                    this.diseasesUnsorted = diseaseData._embedded[environment.linksDiseases] as Array<Disease>;
                    console.log('Disease screen - recovered diseases');
                    const diseaseList = new Array<Disease>();
                    for (const disease of this.diseases) {

                      console.log('DISEASE: ' + disease.omim);

                      let currentLang = this.translateService.currentLang;

                      if (currentLang === undefined) {
                        currentLang = 'es';
                      }

                      console.log('currentLang: ' + currentLang);
                      for (let translation of disease.translations) {
                        if (currentLang.toLowerCase() === translation.language.toLowerCase()) {
                          disease.nameView = translation.name;
                        }
                        console.log('TRANSLATION NAME: ' + translation.name);
                        console.log('TRANSLATION LANGUAGE: ' + translation.language);
                      }
                      console.log('END DISEASE: ' + disease.omim);
                      diseaseList.push(Disease.fromObject(disease));
                    }
                    this.diseases = diseaseList;
                    this.loading = false;
                    clearTimeout(timeout);
                    this.tableService.selectLoadingSearch(false);

                    if (diseaseData.page !== undefined) {
                        this.pagination.currentPag = diseaseData.page.number;
                        this.pagination.numberOfPages = diseaseData.page.totalPages;
                        this.pagination.totalElements = diseaseData.page.totalElements;
                    }
                }
            });
        }
    } else {

      let parameter: string;

      const diseaseAux: Array<Disease> = new Array<Disease>();
      if (this.pagination.textField.toLowerCase() === this.translateService.instant('disease-screen.name-column').toLowerCase()) {
        parameter = 'name';
      } else if (this.pagination.textField.toLowerCase() === this.translateService.instant('disease-screen.omim-column').toLowerCase()) {
        parameter = 'omim';
      }

      this.diseaseService.getDiseaseByParameter(this.pagination, parameter).subscribe(response => {
        if (response._embedded !== null
          && response._embedded !== undefined
          && response._embedded[environment.linksDiseases] !== null
          && response._embedded[environment.linksDiseases] !== undefined) {

          console.log('CNV: ' + response);

          response._embedded[environment.linksDiseases].forEach(element => {
            diseaseAux.push(Disease.fromObject(element));
          });
        }
        if (response.page !== null && response.page !== undefined) {
          this.pagination.currentPag = response.page.number;
          this.pagination.numberOfPages = response.page.totalPages;
          this.pagination.totalElements = response.page.totalElements;
        }
        this.diseases = diseaseAux;
        clearTimeout(timeout);
        this.tableService.selectLoadingSearch(false);
      });

    }
  }

  editDisease(disease: Disease): void {
    console.log('Editing mutation: ' + disease.omim);
    this.editingDisease = new Disease();
    this.copyRequestValues(disease, this.editingDisease);

    this.editingSelectedLanguage = this.editingDisease.translations[0];
    this.editingSelectedLanguageIndex = 0;
    this.editing = true;
    this.geneFormControl.disable();
    const obs = this.geneService.listGenes();
    if (obs !== null && obs !== undefined) {
        obs.subscribe(response => {
            this.genes = response;
            this.genesFiltered = of(this.genes);
         });
    }
    if (this.editingDisease.links !== undefined && this.editingDisease.links !== null) {
        const subs = this.diseaseService.getUrlApiRestV3(this.editingDisease.links[environment.linksGenes][environment.href],
            Gene).subscribe(
            (response: ApiRequest<Gene>) => {
                const url = response._embedded[environment.linksGenes][0][environment.links][environment.self][environment.href];
                this.diseaseService.getUrlApiRestV3(url, Gene).subscribe(
                    responsev3 => {
                        const gene: Gene = Gene.fromObject(responsev3);
                        if (this.editingDisease !== null && this.editingDisease.genes == null) {
                            this.editingDisease.genes = new Array<Gene>();
                        }
                        this.editingDisease.genes.push(gene);
                        this.genesFiltered = this.geneFormControl.valueChanges
                            .pipe(
                                startWith(''),
                                map(value => typeof value === 'string' ? value : value.type),
                                map(type => type ? this.filterGenes(type) : this.genes.slice())
                            );
                        subs.unsubscribe();
                    },
                    error => {
                        console.log(error);
                        this.showNotification('Ocurrió un error al obtener los genes de la enfermedad', 'notification-class');
                        });
            },
            error => {
                console.log(error);
            });
    }
  }

  sortDiseases(event: any): void {
    this.pagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
        this.pagination.sortField = event.active;
        this.pagination.sortOrder = event.direction;
        console.log('Disease screen component - sorting diseases by: ' + event.active);
    }
    this.processListDiseases();
  }

  backButton(): void {
    this.editing = false;
  }

  editButton(): void {
    this.unlockFields = true;
    this.geneFormControl.enable();
  }

  recordButton(): void {
    this.unlockFields = false;
    this.geneFormControl.disable();
  }

  saveModelChanges(): void {
    const sub: Subscription = this.diseaseService.updateDisease(this.editingDisease).subscribe(
            response => {
                sub.unsubscribe();
            },
            error => {
                console.log(error);
                sub.unsubscribe();
            });
    this.showNotification('common-elements.messages.data-saved', 'notification-class');
  }

  copyRequestValues(copyFromDisease: Disease, toDisease: Disease): void {
    toDisease.omim = copyFromDisease.omim;
    toDisease.heredityPattern = copyFromDisease.heredityPattern;
    toDisease.translations = copyFromDisease.translations;

    toDisease.genes = copyFromDisease.genes;
    toDisease.id = copyFromDisease.id;
    toDisease.links = copyFromDisease.links;
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

  addLanguage(languageCode: string): void {
    let existingAlready = false;

    if (languageCode !== '' && languageCode !== undefined) {
      this.editingDisease.translations.forEach (element => {
        if (element.language.toLowerCase() === languageCode.toLowerCase()) {
          this.showNotification('disease-screen.messages.language-exists', 'notification-class');
          existingAlready = true;
        }
      });
      if (!existingAlready) {
        const translation: Translation = new Translation();
        translation.language = languageCode;
        this.editingDisease.translations.push(translation);
      }
    } else {
      this.showNotification('disease-screen.messages.language-empty', 'notification-class');
    }

  }

  associateNewGene(geneName: string): void {
    const pagination: Pagination = new Pagination();
    pagination.textFilter = geneName;
    this.geneService.getGeneByParameter(pagination, 'name').subscribe(
        (response: HalObject) => {
        if (response._embedded[environment.linksGenes] !== null
            && response._embedded[environment.linksGenes] !== undefined
            && response._embedded[environment.linksGenes].length > 0) {
            this.gene = Gene.fromObject(response._embedded[environment.linksGenes][0]);
            const clonedArray  = Object.assign([], this.editingDisease.genes);
            clonedArray.push(this.gene as Gene);
            this.editingDisease.genes = clonedArray; // To be detected, it has to change the whole array
            } else {
                this.showNotification('Error añadiendo el gen', 'notification-class');
            }
        },
        error => {
            console.log(error);
        });
  }

  disassociateGene(event): void {
    const geneList: Array<Gene> = new Array<Gene>();
    this.editingDisease.genes.forEach(element => {
        if (element.geneName !== event.geneName) {
            geneList.push(element);
        }
    });
    this.editingDisease.genes = geneList;
  }

  displayGeneInList(gene: Gene): string {
    return gene && gene.geneName ? gene.geneName : '';
  }

  filterGenes(name: string): Gene[] {
    console.log('Filtering genes: ' + name);
    const filterValue = name.toLowerCase();
    if (this.genes !== undefined && this.genes !== null) {
        return this.genes.filter(gene => gene.geneName.toLowerCase().indexOf(filterValue) === 0);
    } else {
        return new Array<Gene>();
    }
  }

  pageChanged(event): void {
    if (event !== null && event !== undefined) {
        this.pagination.totalElements = event.length;
        this.pagination.currentPag = event.pageIndex;
        this.pagination.currentPagSize = event.pageSize;
    }
    this.processListDiseases();
  }

  textFiltered(event): void {
    if (event !== null && event !== undefined) {
        console.log('GONNA SEARCH BY FIELD:' + event.field);
        console.log('GONNA SEARCH TEXT:' + event.textFilter);
        this.pagination.textFilter = event.target.value;
        this.pagination.currentPag = 0;
        this.pagination.textField = event.field;
    }
    this.processListDiseases();
  }

}
