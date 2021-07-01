import { Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import {forkJoin, Observable, Subscription} from 'rxjs';
import { Mutation, Gene } from '../../models/genetic-model';
import { Pagination } from '../../models/common-model';
import { TableColumn } from '../common/table/table.model';
import { NotificationComponent } from '../common/notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MutationService } from '../../services/genetic/mutation.service';
import { DiseaseService } from '../../services/genetic/disease.service';
import { environment } from '../../../environments/environment';
import { TableComponent } from '../common/table/table.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mutation-screen',
  templateUrl: './mutation-screen.component.html',
  styleUrls: ['./mutation-screen.component.scss']
})
export class MutationScreenComponent implements OnInit, OnDestroy {
  defaultPageSizes = environment.mutationTableDefaultPageSizes;
  @ViewChild('mutationTable') table: TableComponent;

  editing: boolean;
  editingMutation: Mutation;
  editingMutationGenes: Array<Gene>;

  // Subscriptions
  mutationSubscription: Subscription;
  geneSubscription: Array<Subscription>;

  // Objects
  mutations: Mutation[];
  mutationsUnsorted: Mutation[];

  tableColumns: Array<TableColumn>;
  tableColumnsGenes: Array<TableColumn>;
  searchFields: Array<string>;

  pagination: Pagination;
  loading: boolean;

  constructor(public mutationService: MutationService,
              public dialog: MatDialog,
              public diseaseService: DiseaseService,  // To use api V3
              public notificationMessage: MatSnackBar,
              public translateService: TranslateService) { }

  ngOnInit(): void {
    this.loading = true;
    this.pagination = new Pagination();
    this.tableColumns = new Array<TableColumn>();

    const tableColumnActive: TableColumn = {
      name: 'mutation-screen.active-column',
      dataKey: 'active',
      position: 'left',
      isSortable: true,
      showBooleanIcon: true
    };

    const tableColumnGeneName: TableColumn = {
      name: 'mutation-screen.gene-name-column',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };


    const tableColumnAccession: TableColumn = {
      name: 'mutation-screen.accesion-column',
      dataKey: 'accession',
      position: 'left',
      isSortable: true
    };

    const tableColumnHgvs: TableColumn = {
      name: 'mutation-screen.hgvs-column',
      dataKey: 'hgvs',
      position: 'left',
      isSortable: true
    };

    const tableColumnChromosome: TableColumn = {
      name: 'mutation-screen.cromosome-column',
      dataKey: 'chromosome',
      position: 'left',
      isSortable: true
    };

    const tableColumnReferences: TableColumn = {
      name: 'mutation-screen.references-column',
      dataKey: 'references',
      position: 'left',
      isSortable: true
    };

    const tableColumnPanelVersion: TableColumn = {
      name: 'mutation-screen.panel-version-column',
      dataKey: 'panelVersion',
      position: 'left',
      isSortable: true
    };

    const tableColumnDbType: TableColumn = {
      name: 'mutation-screen.db-type-column',
      dataKey: 'dbType',
      position: 'left',
      isSortable: true
    };

    const tableColumnDbVersion: TableColumn = {
      name: 'mutation-screen.db-version-column',
      dataKey: 'dbVersion',
      position: 'left',
      isSortable: true
    };

    const tableColumnType: TableColumn = {
      name: 'mutation-screen.type-column',
      dataKey: 'type',
      position: 'left',
      isSortable: true
    };

    const tableColumnStartPos: TableColumn = {
      name: 'mutation-screen.start-pos-column',
      dataKey: 'startPos',
      position: 'left',
      isSortable: true
    };

    const tableColumnEndPos: TableColumn = {
      name: 'mutation-screen.end-pos-column',
      dataKey: 'endPos',
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
    this.tableColumns.push(tableColumnGeneName);
    this.tableColumns.push(tableColumnAccession);
    this.tableColumns.push(tableColumnHgvs);
    this.tableColumns.push(tableColumnPanelVersion);
    this.tableColumns.push(tableColumnChromosome);
    this.tableColumns.push(tableColumnDbVersion);
    this.tableColumns.push(tableColumnDbType);
    this.tableColumns.push(tableColumnType);
    this.tableColumns.push(tableColumnStartPos);
    this.tableColumns.push(tableColumnEndPos);
    this.tableColumns.push(tableColumnReferences);
    this.tableColumns.push(tableColumnActions);

    // Genes table
    this.tableColumnsGenes = new Array<TableColumn>();

    const tableColumnNameGene: TableColumn = {
      name: 'gene-screen.name-column',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };

    const tableColumnAliasGene: TableColumn = {
      name: 'gene-screen.alias-column',
      dataKey: 'aliases',
      position: 'left',
      isSortable: true
    };

    const tableColumnHgncIdGene: TableColumn = {
      name: 'gene-screen.hgncid-column',
      dataKey: 'hgncId',
      position: 'left',
      isSortable: true
    };

    const tableColumnChromosomeGene: TableColumn = {
      name: 'gene-screen.cromosome-column',
      dataKey: 'chromosome',
      position: 'left',
      isSortable: true
    };

    const tableColumnPanelGene: TableColumn = {
      name: 'gene-screen.gene-panel',
      dataKey: 'panel',
      position: 'left',
      isSortable: true
     };

    const tableColumnActionsGene: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.tableColumnsGenes.push(tableColumnNameGene);
    this.tableColumnsGenes.push(tableColumnAliasGene);
    this.tableColumnsGenes.push(tableColumnHgncIdGene);
    this.tableColumnsGenes.push(tableColumnChromosomeGene);
    this.tableColumnsGenes.push(tableColumnPanelGene);
    this.tableColumnsGenes.push(tableColumnActionsGene);
    this.searchFields = new Array<string>();

    // this.searchFields.push('mutation-screen.hgmd-version-column');
    this.searchFields.push('mutation-screen.hgvs-column');
    this.searchFields.push('mutation-screen.panel-version-column');

    this.processListMutations();
  }

  processListMutations(): void {
    if (this.pagination.textFilter === null || this.pagination.textFilter === '') {
      const mutationArray: Array<Mutation> = new Array<Mutation>();
      const obs = this.mutationService.listMutationPagination(this.pagination);
      if (obs !== null && obs !== undefined) {
        this.mutationSubscription = obs.subscribe(
          response => {
            if (response._embedded !== undefined) {
              response._embedded[environment.linksMutations].forEach(element => {
                  const mutation: Mutation = Mutation.fromObject(element);
                  mutationArray.push(mutation);
              });
              this.mutations = mutationArray;
              this.loading = false;
            }
            if (response.page !== undefined) {
              this.pagination.currentPag = response.page.number;
              this.pagination.numberOfPages = response.page.totalPages;
              this.pagination.totalElements = response.page.totalElements;
            }

            if (this.geneSubscription !== undefined) {
              for (const subscription of this.geneSubscription) {
                subscription.unsubscribe();
              }
            }
            this.geneSubscription = new Array<Subscription>();

            for (const mutation of this.mutations) {
              const subscription = this.mutationService.getMutationGene(mutation).subscribe(geneData => {
                  const gene = geneData as Gene;
                  mutation.geneName = gene.geneName;
              });

              this.geneSubscription.push(subscription);
            }
          },
        error => {
            console.log(error);
          });
      }
    } else {
      let parameter: string;
      if (this.pagination.textField !== undefined && this.pagination.textField !== '') {
        if (this.pagination.textField.toLowerCase()
          === this.translateService.instant('mutation-screen.hgvs-column').toLowerCase()) {
          parameter = 'hgvs';
        } else if (this.pagination.textField.toLowerCase()
          === this.translateService.instant('mutation-screen.panel-version-column').toLowerCase()) {
          parameter = 'panelVersion';
        } else if (this.pagination.textField.toLowerCase()
          === this.translateService.instant('mutation-screen.hgmd-version-column').toLowerCase()) {
          parameter = 'hgmdVersion';
        }
      } else {
        parameter = 'hgvs';
      }

      this.mutationService.getMutationByParameter(this.pagination, parameter).subscribe(data => {
        const mutAux: Array<Mutation> = new Array<Mutation>();
        if (data._embedded !== null
          && data._embedded !== undefined
          && data._embedded[environment.linksMutations] !== null
          && data._embedded[environment.linksMutations] !== undefined) {
          data._embedded[environment.linksMutations].forEach(element => {
            mutAux.push(Mutation.fromObject(element));
          });
        }
        if (data.page !== undefined) {
          this.pagination.currentPag = data.page.number;
          this.pagination.numberOfPages = data.page.totalPages;
          this.pagination.totalElements = data.page.totalElements;
        }
        this.mutations = mutAux;

        if (this.geneSubscription !== undefined) {
          for (const subscription of this.geneSubscription) {
            subscription.unsubscribe();
          }
        }

        this.geneSubscription = new Array<Subscription>();

        for (const mutation of this.mutations) {
          const subscription = this.mutationService.getMutationGene(mutation).subscribe(geneData => {
            const gene = geneData as Gene;
            mutation.geneName = gene.geneName;
          });

          this.geneSubscription.push(subscription);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.mutationSubscription !== undefined) {
      this.mutationSubscription.unsubscribe();
    }

    if (this.geneSubscription !== undefined) {
      for (const subscription of this.geneSubscription) {
        subscription.unsubscribe();
      }
    }
  }

  addMutation(): void {
    console.log('Mutation screen component - addMutation');
    this.editingMutation = new Mutation();
    this.editing = true;
  }

  editMutation(mutation: Mutation): void {
    console.log('Editing mutation: ' + mutation.accession);

    this.editingMutation = new Mutation();
    this.copyRequestValues(mutation, this.editingMutation);
    const auxEditingGenes = new Array<Gene>();

    this.editing = true;
    if (this.editingMutation.links !== undefined && this.editingMutation.links[environment.linksMutationsGenes] !== undefined) {
        const url = this.editingMutation.links[environment.linksMutationsGenes][environment.href];
        if (url !== undefined && url !== null) {
            this.diseaseService.getUrlApiRestV3<Gene>(url, Gene).subscribe(
                response => {
                    auxEditingGenes.push(Gene.fromObject(response));
                    console.log(this.editingMutationGenes);
                    this.editingMutationGenes = auxEditingGenes;
                },
                error => {
                    console.log(error);
                });
        }
    }
  }

  sortMutations(event: any): void {
    this.pagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
        this.pagination.sortField = event.active;
        this.pagination.sortOrder = event.direction;
        console.log('Mutation screen component - sorting diseases by: ' + event.active);
    }
    this.processListMutations();
  }

  backButton(): void {
    this.editing = false;
  }

  saveModelChanges(updatedMutation: Mutation): void {
    for (const mutation of this.mutations) {
      console.log('Comparing mutations: ' + mutation.accession + ' with ' + updatedMutation.accession);
      if (updatedMutation.accession === mutation.accession) {
        this.copyRequestValues(updatedMutation, mutation);
        break;
      }
    }

    this.showNotification('common-elements.messages.data-saved', 'notification-class');
  }

  copyRequestValues(copyFromMutation: Mutation, toMutation: Mutation): void {
    toMutation.accession = copyFromMutation.accession;
    toMutation.hgvs = copyFromMutation.hgvs;
    toMutation.panelVersion = copyFromMutation.panelVersion;
    toMutation.chromosome = copyFromMutation.chromosome;
    toMutation.dbType = copyFromMutation.dbType;
    toMutation.dbVersion = copyFromMutation.dbVersion;
    toMutation.type = copyFromMutation.type;
    toMutation.active = copyFromMutation.active;
    toMutation.startPos = copyFromMutation.startPos;
    toMutation.endPos = copyFromMutation.endPos;
    toMutation.references = copyFromMutation.references;
    toMutation.special = copyFromMutation.special;
    toMutation.show = copyFromMutation.show;
    toMutation.id = copyFromMutation.id;
    toMutation.links = copyFromMutation.links;
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

  toggleTableField(mut: Mutation): void {
      const subs: Subscription = this.mutationService.patchMutation(mut).subscribe(
            response => {
                const mutationReturned: Mutation = Mutation.fromObject(response);
                if (mutationReturned.hgvs === mut.hgvs && mutationReturned.active === mut.active) {
                    this.showNotification('common-elements.messages.data-saved', 'notification-class');
                }
                subs.unsubscribe();
            },
            error => {
                console.log(error);
            });
  }

  pageChanged(event): void {
    if (event !== null && event !== undefined) {
        this.pagination.totalElements = event.length;
        this.pagination.currentPag = event.pageIndex;
        this.pagination.currentPagSize = event.pageSize;
    }
    this.processListMutations();
  }

  textFiltered(event): void {
    if (event !== null && event !== undefined) {
        this.pagination.textFilter = event.target.value;
        this.pagination.currentPag = 0;
        this.pagination.textField = event.field;
    }
    this.processListMutations();
  }

  openDialog(event): void {
      if (event.length > 1) {
          if (event[1] instanceof Mutation) {
              const dialogRef = this.dialog.open(MutationDialogComponent, {
                width: '250px',
                data: {title: this.translateService.instant('common-elements.buttons.confirm'),
                       message: this.translateService.instant('mutation-screen.mut-activate-message'),
                       close: this.translateService.instant('common-elements.buttons.cancel'),
                       confirm: this.translateService.instant('common-elements.buttons.confirm'),
                       mut: event[1],
                       mutScreen: this}
              });
              dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed');
                console.log(result);
              });
            }
      }
  }

}

export interface DialogData {
    title: string;
    message: string;
    close: string;
    confirm: string;
    mut: Mutation;
    mutScreen: MutationScreenComponent;
  }

@Component({
    selector: 'app-mutation-dialog-component',
    templateUrl: 'dialog-confirm-mutation-activation.html',
  })
  export class MutationDialogComponent {

    constructor(
      public dialogRef: MatDialogRef<MutationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

    toggleMutation(data): void {
      this.dialogRef.close();
      data.mutScreen.toggleTableField(data.mut);
    }
  }

