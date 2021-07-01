import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Gene, CnvRequest } from '../../models/genetic-model';
import { Subscription, Observable } from 'rxjs';
import { TableColumn } from '../common/table/table.model';
import { CnvRequestService } from '../../services/genetic/cnv-request.service';
import { environment } from '../../../environments/environment';
import { DiseaseService } from '../../services/genetic/disease.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../common/notification/notification.component';
import { HalObject, Pagination } from '../../models/common-model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {TableService} from '../../services/common/table.service';

@Component({
  selector: 'app-cnv-screen',
  templateUrl: './cnv-screen.component.html',
  styleUrls: ['./cnv-screen.component.scss']
})
export class CnvScreenComponent implements OnInit, OnDestroy {
  defaultPageSizes = environment.cnvTableDefaultPageSizes;
  editing: boolean;
  editingCnv: CnvRequest;

  cnvSubscription: Subscription;
  geneSubscription: Array<Subscription>;

  cnvs: Array<CnvRequest>;
  editingCnvGene: Array<Gene>;

  tableColumns: Array<TableColumn>;
  pagination: Pagination;
  tableColumnsGenes: Array<TableColumn>;
  searchFields: Array<string>;
  loading: boolean;

  constructor(
    public cnvRequestService: CnvRequestService,
    public diseaseService: DiseaseService, // To use apiv3
    public notificationMessage: MatSnackBar,
    public dialog: MatDialog,
    public translateService: TranslateService,
    public tableService: TableService
  ) {}

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.cnvs = new Array<CnvRequest>();
    this.tableColumns = new Array<TableColumn>();
    this.editingCnv = null;
    this.editingCnvGene = new Array<Gene>();
    this.loading = true;

    const tableActiveColumn: TableColumn = {
      name: 'cnv-screen.cnv-active-column',
      dataKey: 'active',
      position: 'left',
      isSortable: false,
      showBooleanIcon: true
    };

    const tableCopyNumberColumn: TableColumn = {
      name: 'cnv-screen.cnv-panel-version-column',
      dataKey: 'panelVersion',
      position: 'left',
      isSortable: true
    };

    const tableMeanCoverageColumn: TableColumn = {
      name: 'cnv-screen.cnv-location-column',
      dataKey: 'location',
      position: 'left',
      isSortable: true
    };

    const tableTranscriptColumn: TableColumn = {
      name: 'cnv-screen.cnv-transcript-column',
      dataKey: 'transcript',
      position: 'left',
      isSortable: true
    };

    const tableChromosomeColumn: TableColumn = {
      name: 'cnv-screen.cnv-chromosome-column',
      dataKey: 'chromosome',
      position: 'left',
      isSortable: true
    };

    const tableStartPosColumn: TableColumn = {
      name: 'cnv-screen.cnv-copy-number-column',
      dataKey: 'startPos',
      position: 'left',
      isSortable: true
    };

    const tableEndPosColumn: TableColumn = {
      name: 'cnv-screen.cnv-end-pos-column',
      dataKey: 'endPos',
      position: 'left',
      isSortable: true
    };

    const tableLogRatioColumn: TableColumn = {
      name: 'cnv-screen.cnv-log-ratio-column',
      dataKey: 'logRatio',
      position: 'left',
      isSortable: true
    };

    const tableTagColumn: TableColumn = {
      name: 'cnv-screen.cnv-tag-column',
      dataKey: 'tag',
      position: 'left',
      isSortable: true
    };

    const tableCommentColumn: TableColumn = {
      name: 'cnv-screen.cnv-comment-column',
      dataKey: 'comment',
      position: 'left',
      isSortable: true
    };

    const tableGeneNameColumn: TableColumn = {
      name: 'cnv-screen.cnv-gene-name-column',
      dataKey: 'geneName',
      position: 'left',
      isSortable: true
    };

    const tableExonNumberColumn: TableColumn = {
      name: 'cnv-screen.cnv-exon-number-column',
      dataKey: 'exonNumber',
      position: 'left',
      isSortable: true
    };

    const tableTypeColumn: TableColumn = {
      name: 'cnv-screen.cnv-type-column',
      dataKey: 'type',
      position: 'left',
      isSortable: true
    };

    const tablepanelVersionColumn: TableColumn = {
      name: 'cnv-screen.cnv-panel-version-column',
      dataKey: 'panelVersion',
      position: 'left',
      isSortable: true
    };
    const tableLocationColumn: TableColumn = {
      name: 'cnv-screen.cnv-location-column',
      dataKey: 'location',
      position: 'left',
      isSortable: true
    };

    const tableColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.tableColumns.push(tableActiveColumn);
    this.tableColumns.push(tableGeneNameColumn);
    this.tableColumns.push(tablepanelVersionColumn);
    this.tableColumns.push(tableLocationColumn);
    this.tableColumns.push(tableTranscriptColumn);
    this.tableColumns.push(tableExonNumberColumn);
    this.tableColumns.push(tableChromosomeColumn);
    this.tableColumns.push(tableStartPosColumn);
    this.tableColumns.push(tableEndPosColumn);
    this.tableColumns.push(tableColumnActions);

    this.cnvs = new Array<CnvRequest>();

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
    this.searchFields.push('cnv-screen.cnv-transcript-column');

    this.processListCnvs();
  }

  ngOnDestroy(): void {
    if (this.cnvSubscription !== undefined) {
      this.cnvSubscription.unsubscribe();
    }
  }

  processListCnvs(): void {
    console.log('textField: ' + this.pagination.textField);
    console.log('textFilter: ' + this.pagination.textFilter);
    console.log('sortField: ' + this.pagination.sortField);
    console.log('sortOrder: ' + this.pagination.sortOrder);

    if (this.pagination.textFilter === null || this.pagination.textFilter === '') {
      const list = new Array<CnvRequest>();
      this.cnvSubscription = this.cnvRequestService.listCnvsRequestsPagination(this.pagination).subscribe(
        (response: HalObject) => {
        if (response._embedded !== undefined && response._embedded[environment.linksCnvs] !== undefined) {
          response._embedded[environment.linksCnvs].forEach(element => {
              list.push(CnvRequest.fromObject(element));
          });
          this.cnvs = list;
          this.loading = false;
          this.tableService.selectLoadingSearch(false);
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

        for (const mutation of this.cnvs) {
          const subscription = this.cnvRequestService.getCnvGene(mutation).subscribe(geneData => {
            const gene = geneData as Gene;
            mutation.geneName = gene.geneName;
          });

          this.geneSubscription.push(subscription);
        }
      });
    } else {
      const timeout = setTimeout(() => {
        this.tableService.selectLoadingSearch(true);
      }, 1000);

      const cnvAux: Array<CnvRequest> = new Array<CnvRequest>();
      this.cnvRequestService.getCnvByParameter(this.pagination, 'transcript').subscribe(response => {
        if (response._embedded !== null
          && response._embedded !== undefined
          && response._embedded[environment.linksCnvs] !== null
          && response._embedded[environment.linksCnvs] !== undefined) {

          response._embedded[environment.linksCnvs].forEach(element => {
              cnvAux.push(CnvRequest.fromObject(element));
          });
        }
        if (response.page !== null && response.page !== undefined) {
          this.pagination.currentPag = response.page.number;
          this.pagination.numberOfPages = response.page.totalPages;
          this.pagination.totalElements = response.page.totalElements;
        }
        this.cnvs = cnvAux;
        clearTimeout(timeout);
        this.tableService.selectLoadingSearch(false);

        if (this.geneSubscription !== undefined) {
          for (const subscription of this.geneSubscription) {
            subscription.unsubscribe();
          }
        }

        this.geneSubscription = new Array<Subscription>();

        for (const mutation of this.cnvs) {
          const subscription = this.cnvRequestService.getCnvGene(mutation).subscribe(geneData => {
            const gene = geneData as Gene;
            mutation.geneName = gene.geneName;
          });

          this.geneSubscription.push(subscription);
        }
      });
    }
  }

  editCnv(event): void {
    this.editingCnv = event as CnvRequest;
    const auxCnvGenes = new Array<Gene>();
    this.editing = true;

    if (this.editingCnv !== null && this.editingCnv.links !== null) {
      const url: string = this.editingCnv.links[environment.linksGene][environment.href];
      console.log(url);
      const subs: Subscription = this.diseaseService.getUrlApiRestV3(url, Gene).subscribe(
        response => {
          auxCnvGenes.push(Gene.fromObject(response));
          subs.unsubscribe();
          this.editingCnvGene = auxCnvGenes;
        });
    }
  }

  backButton(): void {
    this.editing = false;
    this.editingCnv = null;
    this.editingCnvGene = new Array<Gene>();
  }

  openDialog(event): void {
    if (event.length > 1) {
      if (event[1] instanceof CnvRequest) {
        const dialogRef = this.dialog.open(DialogOverviewConfirmActivationComponent, {
          width: '250px',
          data: {
            title: this.translateService.instant('common-elements.buttons.confirm'),
              message: this.translateService.instant('cnv-screen.cnv-activate-message'),
              close: this.translateService.instant('common-elements.buttons.cancel'),
              confirm: this.translateService.instant('common-elements.buttons.confirm'),
              cnv: event[1],
              CnvScreen: this
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          console.log(result);
        });
      }
    }
  }

  toggleCnv(cnv): void {
    const obs: Observable<CnvRequest> = this.cnvRequestService.patchCnv(cnv);
    if (obs !== null && obs !== undefined) {
      const subs: Subscription = obs.subscribe(
        response => {
          console.log(CnvRequest.fromObject(response));
          if (CnvRequest.fromObject(response).id === (cnv as CnvRequest).id &&
              CnvRequest.fromObject(response).active === (cnv as CnvRequest).active ) {
            this.showNotification('common-elements.messages.data-saved', 'notification-class');
          }
          subs.unsubscribe();
        },
        error => {
            console.log(error);
        });
    }
  }

  sortCnvs(event: any): void {
    this.pagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
      this.pagination.sortField = event.active;
      this.pagination.sortOrder = event.direction;
    }
    this.processListCnvs();
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
    this.processListCnvs();
  }

  textFiltered(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.textFilter = event.target.value;
      this.pagination.currentPag = 0;
      // this.pagination.textField = event.field;
    }
    this.processListCnvs();
  }

}

export interface DialogData {
  title: string;
  message: string;
  close: string;
  confirm: string;
  cnv: CnvRequest;
  CnvScreen: CnvScreenComponent;
}

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: 'dialog-confirm-cnv-activation.html',
})
export class DialogOverviewConfirmActivationComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewConfirmActivationComponent>,
    public translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleCnv(data): void {
    this.dialogRef.close();
    data.CnvScreen.toggleCnv(data.cnv);
  }
}

