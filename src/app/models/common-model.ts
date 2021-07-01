import {Action, Condition} from './genetic-model';
import {Request} from './administrative-model';

export const PRECON_DATE_FORMAT = {
    parse: {
        dateInput: 'DD-MM-YYYY',
    },
    display: {
        dateInput: 'MMM DD, YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    },
};

export class HalObject {
    '_embedded': Array<any>;
    '_links': {
        self: { href: string; },
        first: { href: string; },
        last: { href: string; },
        next: { href: string; },
        previous: { href: string; },
        search: { href: string; }
    };
    'page': Page;
}

export class Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export class TableOrder {
    ORDER_ASC: 'asc';
    ORDER_DESC: 'desc';

    orderParameter: string;
    order: string;
}

export class Pagination {
    currentPag: number;
    currentPagSize: number;
    sortField: string;
    sortOrder: string;
    textFilter: string;
    textField: string;
    numberOfPages: number;
    totalElements: number;

    public constructor(currPag?: number, pagSize?: number, pagNumber?: number, elementsNumber?: number,
                       order?: string, field?: string, text?: string, textField?: string) {
        this.currentPag = currPag || 0;
        this.currentPagSize = pagSize || 20;
        this.sortOrder = order || '';
        this.sortField = field || '';
        this.textFilter = text || '';
        this.numberOfPages = pagNumber || 1;
        this.totalElements = elementsNumber || 1;
        this.textField = textField || '';
    }

}

export interface RuleDialogData {
    isCondition: boolean;
    isConditionA: boolean;
    dialogConditionType: string;
    conditionSelected: Condition;
    actionSelected: Action;
}

export interface ImportMatchDialogData {
    requests: Array<Request>;
}
