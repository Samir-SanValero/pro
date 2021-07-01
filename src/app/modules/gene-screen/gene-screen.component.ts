import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Gene, Mutation} from '../../models/genetic-model';
import { TableColumn } from '../common/table/table.model';
import { NotificationComponent } from '../common/notification/notification.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneService } from '../../services/genetic/gene.service';
import { HalObject, Pagination } from '../../models/common-model';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { TableService } from '../../services/common/table.service';
import { MutationService } from '../../services/genetic/mutation.service';

@Component({
  selector: 'app-gene-screen',
  templateUrl: './gene-screen.component.html',
  styleUrls: ['./gene-screen.component.scss']
})
export class GeneScreenComponent implements OnInit, OnDestroy {
  defaultPageSizes = environment.geneTableDefaultPageSizes;
  editing: boolean;
  editingGene: Gene;

  // Subscriptions
  geneSubscription: Subscription;
  mutationSubscription: Subscription;

  // Objects
  genes: Gene[];
  genesUnsorted: Gene[];

  geneMutations: Mutation[];
  genesMutationsUnsorted: Mutation[];

  tableColumns: Array<TableColumn>;
  mutationTableColumns: Array<TableColumn>;

  pagination: Pagination;
  mutationPagination: Pagination;

  searchFields: Array<string>;
  loading: boolean;

  constructor(
    public geneService: GeneService,
    public dialog: MatDialog,
    public notificationMessage: MatSnackBar,
    public translateService: TranslateService,
    public tableService: TableService,
    public mutationService: MutationService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.pagination = new Pagination();
    this.mutationPagination = new Pagination();
    this.editing = false;
    this.tableColumns = new Array<TableColumn>();

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

    this.tableColumns.push(tableColumnName);
    this.tableColumns.push(tableColumnAlias);
    this.tableColumns.push(tableColumnHgncId);
    this.tableColumns.push(tableColumnChromosome);
    this.tableColumns.push(tableColumnPanel);
    this.tableColumns.push(tableColumnActions);
    this.searchFields = new Array<string>();
    this.searchFields.push('gene-screen.gene-name');

    this.mutationTableColumns = new Array<TableColumn>();

    const mutationTableColumnActive: TableColumn = {
      name: 'mutation-screen.active-column',
      dataKey: 'active',
      position: 'left',
      isSortable: true,
      showBooleanIcon: true
    };

    const mutationTableColumnAccession: TableColumn = {
      name: 'mutation-screen.accesion-column',
      dataKey: 'accession',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnHgvs: TableColumn = {
      name: 'mutation-screen.hgvs-column',
      dataKey: 'hgvs',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnChromosome: TableColumn = {
      name: 'mutation-screen.cromosome-column',
      dataKey: 'chromosome',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnReferences: TableColumn = {
      name: 'mutation-screen.references-column',
      dataKey: 'references',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnPanelVersion: TableColumn = {
      name: 'mutation-screen.panel-version-column',
      dataKey: 'panelVersion',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnDbType: TableColumn = {
      name: 'mutation-screen.db-type-column',
      dataKey: 'dbType',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnDbVersion: TableColumn = {
      name: 'mutation-screen.db-version-column',
      dataKey: 'dbVersion',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnType: TableColumn = {
      name: 'mutation-screen.type-column',
      dataKey: 'type',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnStartPos: TableColumn = {
      name: 'mutation-screen.start-pos-column',
      dataKey: 'startPos',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnEndPos: TableColumn = {
      name: 'mutation-screen.end-pos-column',
      dataKey: 'endPos',
      position: 'left',
      isSortable: true
    };

    const mutationTableColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.mutationTableColumns.push(mutationTableColumnActive);
    this.mutationTableColumns.push(mutationTableColumnAccession);
    this.mutationTableColumns.push(mutationTableColumnHgvs);
    this.mutationTableColumns.push(mutationTableColumnPanelVersion);
    this.mutationTableColumns.push(mutationTableColumnChromosome);
    this.mutationTableColumns.push(mutationTableColumnDbVersion);
    this.mutationTableColumns.push(mutationTableColumnDbType);
    this.mutationTableColumns.push(mutationTableColumnType);
    this.mutationTableColumns.push(mutationTableColumnStartPos);
    this.mutationTableColumns.push(mutationTableColumnEndPos);
    this.mutationTableColumns.push(mutationTableColumnReferences);
    this.mutationTableColumns.push(mutationTableColumnActions);

    this.processListGenes();
  }

  ngOnDestroy(): void {
    if (this.geneSubscription !== undefined) {
      this.geneSubscription.unsubscribe();
    }

    if (this.mutationSubscription !== undefined) {
      this.mutationSubscription.unsubscribe();
    }
  }

  processListGenes(): void {
    const timeout = setTimeout(() => {
      this.tableService.selectLoadingSearch(true);
    }, 1000);

    if (this.pagination.textFilter === null || this.pagination.textFilter === '') {
      const list = new Array<Gene>();
      const obs = this.geneService.listGenesPagination(this.pagination);
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
            this.pagination.currentPag = geneData.page.number;
            this.pagination.numberOfPages = geneData.page.totalPages;
            this.pagination.totalElements = geneData.page.totalElements;
          }
        });
      }
    } else {
      const geneAux = new Array<Gene>();

      this.geneService.getGeneByParameter(this.pagination, 'name').subscribe(response => {
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
          this.pagination.currentPag = response.page.number;
          this.pagination.numberOfPages = response.page.totalPages;
          this.pagination.totalElements = response.page.totalElements;
        }
        this.genes = geneAux;
        clearTimeout(timeout);
        this.tableService.selectLoadingSearch(false);
      });
    }
  }

  processListMutations(gene: Gene): void {
    this.mutationPagination = new Pagination();
    this.mutationPagination.textField = 'geneName';
    this.mutationPagination.textFilter = gene.geneName;

    if (this.mutationSubscription !== undefined) {
      this.mutationSubscription.unsubscribe();
    }

    this.mutationSubscription = this.mutationService.getMutationByParameter(this.mutationPagination, 'geneName').subscribe(mutationData => {
      let list = mutationData._embedded[environment.linksMutations] as Array<Mutation>;
      console.log('MUTATION LIST: ' + list.length);

      const mutAux: Array<Mutation> = new Array<Mutation>();
      if (mutationData._embedded !== null
        && mutationData._embedded !== undefined
        && mutationData._embedded[environment.linksMutations] !== null
        && mutationData._embedded[environment.linksMutations] !== undefined) {
        mutationData._embedded[environment.linksMutations].forEach(element => {
          mutAux.push(Mutation.fromObject(element));
        });
      }

      console.log('mutaciones recuperadas: ' + mutAux.length);

      if (mutationData.page !== undefined) {
        this.mutationPagination.currentPag = mutationData.page.number;
        this.mutationPagination.numberOfPages = mutationData.page.totalPages;
        this.mutationPagination.totalElements = mutationData.page.totalElements;
      }
      this.geneMutations = mutAux;
    });
  }

  addGene(): void {
    console.log('Gene screen component - addGene');
    this.editingGene = new Gene();
    this.editing = true;
  }

  editGene(gene: Gene): void {
    this.mutationPagination = new Pagination();
    console.log('Editing gene: ' + gene.hgncId);
    console.log('Editing gene name: ' + gene.geneName);

    this.editingGene = new Gene();
    this.copyRequestValues(gene, this.editingGene);
    this.editing = true;

    this.processListMutations(gene);
  }

  sortGenes(event: any): void {
    this.pagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
        this.pagination.sortField = event.active;
        this.pagination.sortOrder = event.direction;
    }
    this.processListGenes();
  }

  backButton(): void {
    this.editing = false;

    this.geneMutations = new Array<Mutation>();
  }

  copyRequestValues(copyFromGene: Gene, toGene: Gene): void {
    toGene.geneName = copyFromGene.geneName;
    toGene.finalName = copyFromGene.finalName;
    toGene.hgncId = copyFromGene.hgncId;
    toGene.chromosome = copyFromGene.chromosome;
    toGene.aliases = copyFromGene.aliases;
    toGene.panel = copyFromGene.panel;
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

  pageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.totalElements = event.length;
      this.pagination.currentPag = event.pageIndex;
      this.pagination.currentPagSize = event.pageSize;
    }
    this.processListGenes();
  }

  pageChangedMutations(event): void {
    if (event !== null && event !== undefined) {
      this.mutationPagination.totalElements = event.length;
      this.mutationPagination.currentPag = event.pageIndex;
      this.mutationPagination.currentPagSize = event.pageSize;
    }
    this.processListGenes();
  }

  textFiltered(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.textFilter = event.target.value;
      this.pagination.currentPag = 0;
      this.pagination.textField = event.field;
    }
    this.processListGenes();
  }
}
