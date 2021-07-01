import { Injectable } from '@angular/core';
import { TableParameters } from './table.parameters';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableOrder } from '../../models/common-model';

@Injectable({ providedIn: 'root' })
export class TableService {

    pageNumberSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    pageNumber: Observable<number>;

    pageSizeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(100);
    pageSize: Observable<number>;

    orderFilterSubject: BehaviorSubject<TableOrder> = new BehaviorSubject<TableOrder>(new TableOrder());
    orderFilter: Observable<TableOrder>;

    totalItemsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(100);
    totalItems: Observable<number>;

    totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(50);
    totalPages: Observable<number>;

    loadingSearchSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    loadingSearch: Observable<boolean>;

    searchParametersList: Array<TableParameters>;

    constructor() {
        this.searchParametersList = new Array<TableParameters>();
    }

    selectTotalPages(totalPages: number): Observable<number> {
        if (totalPages !== this.totalItemsSubject.getValue()) {
            this.totalItemsSubject.next(totalPages);
        }
        return this.totalPagesSubject.asObservable();
    }

    getSelectedTotalPages(): Observable<number> {
        return this.totalPagesSubject.asObservable().pipe();
    }

    selectTotalItems(totalItems: number): Observable<number> {
        if (totalItems !== this.totalItemsSubject.getValue()) {
            this.totalItemsSubject.next(totalItems);
        }
        return this.totalItemsSubject.asObservable();
    }

    getSelectedTotalItems(): Observable<number> {
        return this.totalItemsSubject.asObservable().pipe();
    }

    selectPageNumber(page: number): Observable<number> {
        if (page !== this.pageNumberSubject.getValue()) {
            this.pageNumberSubject.next(page);
        }
        return this.pageNumberSubject.asObservable();
    }

    getSelectedPageNumber(): Observable<number> {
        return this.pageNumberSubject.asObservable().pipe();
    }

    selectPageSize(pageSize: number): Observable<number> {
        if (pageSize !== this.pageNumberSubject.getValue()) {
            console.log('SELECTING PAGE SIZE: ' + pageSize);
            this.pageSizeSubject.next(pageSize);
        }
        return this.pageSizeSubject.asObservable();
    }

    getSelectedPageSize(): Observable<number> {
        return this.pageSizeSubject.asObservable().pipe();
    }

    selectOrder(order: TableOrder): Observable<TableOrder> {
        this.orderFilterSubject.next(order);
        return this.orderFilterSubject.asObservable();
    }

    getSelectedOrder(): Observable<TableOrder> {
        return this.orderFilterSubject.asObservable().pipe();
    }

    setSearchEvent(tableName: string, event: any): void {
        console.log('Table Service - setSearchEvent');
        let exists = false;

        for (const parameter of this.searchParametersList) {
            if (parameter.tableName === tableName) {
                console.log('Table Service - setSearchEvent does exist');
                parameter.searchEvent = event;
                exists = true;
            }
        }

        if (!exists) {
            console.log('Table Service - setSearchEvent does not exist, creating parameter');
            const tableParameter = new TableParameters();
            tableParameter.tableName = tableName;
            tableParameter.searchEvent = event;
            this.searchParametersList.push(tableParameter);
        }
    }

    getSearchEvent(tableName: string): any {
        console.log('Table Service - getSearchEvent of table: ' + tableName);

        for (const parameter of this.searchParametersList) {
            if (parameter.tableName === tableName) {
                console.log('Table Service - getSearchEvent does exist');
                return parameter.searchEvent;
            }
        }
        return undefined;
    }

    setSearchText(tableName: string, searchText: string): void {
        console.log('Table Service - setSearchText');

        let exists = false;

        for (const parameter of this.searchParametersList) {
            if (parameter.tableName === tableName) {
                console.log('Table Service - setSearchText does exist');
                parameter.searchText = searchText;
                exists = true;
            }
        }

        if (!exists) {
            console.log('Table Service - setSearchText does not exist, creating parameter');
            const tableParameter = new TableParameters();
            tableParameter.searchText = searchText;
            tableParameter.tableName = tableName;
            this.searchParametersList.push(tableParameter);
        }
    }

    getSearchText(tableName: string): string {
        console.log('Table Service - getSearchText of table: ' + tableName);

        for (const parameter of this.searchParametersList) {
            if (parameter.tableName === tableName) {
                console.log('Table Service - getSearchPageNumber does exist');
                return parameter.searchText;
            }
        }
        return undefined;
    }

    setSearchPageNumber(tableName: string, pageNumber: number): void {
        console.log('Table Service - setSearchPageNumber of table: ' + tableName);

        let exists = false;

        for (const parameter of this.searchParametersList) {
            console.log('Table Service - setSearchPageNumber does exist');
            if (parameter.tableName === tableName) {
                parameter.searchPageNumber = pageNumber;
                exists = true;
            }
        }

        if (!exists) {
            console.log('Table Service - setSearchPageNumber does not exist, creating parameter');
            const tableParameter = new TableParameters();
            tableParameter.searchPageNumber = pageNumber;
            tableParameter.tableName = tableName;
            this.searchParametersList.push(tableParameter);
        }
    }

    getSearchPageNumber(tableName: string): number {
        console.log('Table Service - getSearchPageNumber of table: ' + tableName);

        for (const parameter of this.searchParametersList) {
            if (parameter.tableName === tableName) {
                console.log('Table Service - getSearchPageNumber does exist');
                return parameter.searchPageNumber;
            }
        }
        return undefined;
    }

    selectLoadingSearch(loading: boolean): Observable<boolean> {
        this.loadingSearchSubject.next(loading);
        return this.loadingSearchSubject.asObservable();
    }

    getLoadingSearch(): Observable<boolean> {
        return this.loadingSearchSubject.asObservable().pipe();
    }

}

