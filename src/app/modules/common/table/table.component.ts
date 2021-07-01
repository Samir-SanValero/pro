import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { TableColumn } from './table.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TableService } from '../../../services/common/table.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import {Disease} from '../../../models/genetic-model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  public tableDataSource = new MatTableDataSource([]);
  public displayedColumns: string[];
  public searchText: string;
  public totalItems: number;
  currentPageSize: number;
  currentPageNumber: number;
  loadingSearch: boolean;

  totalItemsSubscription: Subscription;
  totalPagesSubscription: Subscription;
  loadingSearchSubscription: Subscription;
  selectedField: string;
  searchFormControl: FormControl;

  @ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild('searchField') fieldToSearch: HTMLSelectElement;

  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() tableColumns: TableColumn[];
  @Input() rowActionIcon: string;
  @Input() paginationSizes: number[] = [20, 100, 500];
  @Input() defaultPageSize = this.paginationSizes[0];
  @Input() numberOfElements = 1;
  @Input() currentPage = 0;
  @Input() tableName: string;

  @Input() newActionButtonText: string;
  @Input() editActionButtonText: string;
  @Input() editActionIcon: string;
  @Input() deleteActionButtonText: string;
  @Input() reportActionButtonText: string;
  @Input() uploadActionButtonText: string;
  @Input() searchFields: Array<string>;
  @Input() tableBackgroundColor: string;

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() newAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() editAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() reportAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() uploadAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowClickAction: EventEmitter<any> = new EventEmitter<any>();

  @Output() filterAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() booleanFieldAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventPageChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() setFilter: any;

  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }

  constructor(
    public translateService: TranslateService,
    public tableService: TableService
  ) {}

  ngOnInit(): void {
    this.loadingSearch = false;
    this.searchText = '';
    if (this.searchFormControl === undefined) {
      this.searchFormControl = new FormControl();
    }

    if (this.tableBackgroundColor === undefined) {
      this.tableBackgroundColor = '#f2f2f2';
    }

    if (this.newActionButtonText === undefined) {
      this.newActionButtonText = 'Nuevo';
    }

    if (this.deleteActionButtonText === undefined) {
      this.deleteActionButtonText = 'Eliminar';
    }

    if (this.reportActionButtonText === undefined) {
      this.reportActionButtonText = 'Informe';
    }

    if (this.uploadActionButtonText === undefined) {
      this.uploadActionButtonText = 'Subir';
    }

    if (this.editActionIcon === undefined) {
      this.editActionIcon = 'create';
    }

    const columnNames = this.tableColumns.map((tableColumn: TableColumn) => tableColumn.name);
    if (this.rowActionIcon) {
      this.displayedColumns = [this.rowActionIcon, ...columnNames];
    } else {
      this.displayedColumns = columnNames;
    }

    if (this.searchFields !== undefined && this.searchFields.length > 0) {
      this.selectedField = this.translateService.instant(this.searchFields[0]);
      this.searchFormControl.patchValue(this.translateService.instant(this.searchFields[0]));
    }

    this.tableService.getLoadingSearch().subscribe(loadingSearchData => {
      this.loadingSearch = loadingSearchData as boolean;
    });
  }

  ngOnDestroy(): void {
    if (this.loadingSearchSubscription !== undefined) {
      this.loadingSearchSubscription.unsubscribe();
    }

    if (this.totalItemsSubscription !== undefined) {
      this.totalItemsSubscription.unsubscribe();
    }

    if (this.totalPagesSubscription !== undefined) {
      this.totalPagesSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (this.matPaginator !== undefined) {
      this.matPaginator._intl.firstPageLabel = this.translateService.instant('common-elements.table-paginator.first-page');
      this.matPaginator._intl.lastPageLabel = this.translateService.instant('common-elements.table-paginator.last-page');
      this.matPaginator._intl.nextPageLabel = this.translateService.instant('common-elements.table-paginator.next-page');
      this.matPaginator._intl.previousPageLabel = this.translateService.instant('common-elements.table-paginator.previous-page');
      this.matPaginator._intl.itemsPerPageLabel = this.translateService.instant('common-elements.table-paginator.items-per-page');
    }

    const searchText = this.tableService.getSearchText(this.tableName);
    const searchEvent = this.tableService.getSearchEvent(this.tableName);
    const searchPageNumber = this.tableService.getSearchPageNumber(this.tableName);

    console.log('TableName: ' + this.tableName);
    console.log('Retrieved search event: ' + searchEvent);
    console.log('Retrieved search text: ' + searchText);
    console.log('Retrieved search page number: ' + searchPageNumber);

    if (searchEvent !== undefined) {
      console.log('SearchEvent: ' + searchEvent);
      this.applyFilter(searchEvent);
    }

    if (searchText !== undefined) {
      console.log('SearchText: ' + searchText);
      this.searchText = searchText;
    }

    if (searchPageNumber !== undefined) {
      console.log('PageNumber: ' + searchPageNumber);
      this.matPaginator.pageIndex = searchPageNumber;
    }
  }

  setTableDataSource(data: any): void {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.sort = this.matSort;
  }

  applyFilter(event: Event): void {
    console.log('Searching in table');
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    this.tableService.setSearchEvent(this.tableName, event);
    this.tableService.setSearchText(this.tableName, filterValue);
  }

  sortTable(sortParameters: Sort): void {
    console.log('SORTING');
    // defining name of data property, to sort by, instead of column name
    sortParameters.active = this.tableColumns.find(column => column.name === sortParameters.active).dataKey;
    this.sort.emit(sortParameters);
  }

  emitEditRowAction(row: any): void {
    console.log('Table edit action selected');
    this.editAction.emit(row);
  }

  emitDeleteRowAction(row: any): void {
    console.log('Table delete action selected');
    this.deleteAction.emit(row);
  }

  emitReportRowAction(row: any): void {
    console.log('Table report action selected');
    this.reportAction.emit(row);
  }

  emitUploadRowAction(row: any): void {
    console.log('Table upload action selected');
    this.uploadAction.emit(row);
  }

  emitRowClickAction(row: any): void {
    console.log('Table row click action selected');
    this.rowClickAction.emit(row);
  }

  emitNewAction(): void {
    console.log('Table new button action selected');
    this.newAction.emit();
  }

  emitSearchAction(event): void {
    if (event.key === 'Enter') {
      console.log(event);
      console.log('Table searched');
      console.log('SELECTED FIELD: ' + this.selectedField);
      event.field = this.translateService.instant(this.selectedField);
      this.searchAction.emit(event);
    }
  }

  emitBooleanFieldAction(dataKey, $event): void {
    console.log('Table Boolean field toggled');
    this.booleanFieldAction.emit([dataKey, $event] );
  }

  moveColumn(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  pageChanged(event: any): void {
    if (this.currentPageNumber !== event.pageIndex) {
      console.log('Page changed: ' + event.pageIndex);
      this.currentPageNumber = event.pageIndex;
      // this.tableService.setSearchPageNumber(this.tableName, event.pageIndex);
      // this.tableService.selectPageNumber(event.pageIndex);
    }

    if (this.currentPageSize !== event.pageSize) {
      console.log('Page changed size: ' + event.pageSize);
      this.currentPageSize = event.pageSize;
      // this.tableService.selectPageSize(event.pageSize);
      // this.tableService.selectPageNumber(0);
    }
    if (this.selectedField !== undefined && this.selectedField !== null) {
      event.field = this.translateService.instant(this.selectedField);
    }
    this.eventPageChange.emit(event);
  }

  displayDate(value: string): string {
    try {
      if (value !== undefined && value !== null) {
        let satinizedValue = value;
        satinizedValue = satinizedValue.substring(0, satinizedValue.indexOf('T'));
        return satinizedValue;
      }
    } catch (e) {
      console.log('Error displaying date: ' + value);
      return value;
    }
  }

  changeSearchSelector(parameter: string): void {
    console.log('CHANGE SELECTOR: ' + parameter);
    this.selectedField = parameter;
    this.searchFormControl.patchValue(parameter);
  }
}
