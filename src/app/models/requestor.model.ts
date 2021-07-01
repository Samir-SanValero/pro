import { MatchResultData } from './matchResultData.model';
import { Person } from './person.model';
import { UncoveredData } from './uncoveredData.model';
import { VariantData } from './variantData.model';
import { Request } from './administrative-model';

export class Requestor extends Person {
    requestorName?: string;
    reportReceiver?: string;
    hospital?: string;
    department?: string;
    variantsData?: VariantData[];
    uncoveredData?: UncoveredData[];
    woman?: Person;
    man?: Person;
    person?: Person;
    resultsRiskResult?: string;
    showExtCodeSource?: boolean;
    showExtCodeTargets?: boolean;
    matchResultData?: MatchResultData;
    request?: Request;
    constructor(data?: any) {
        data = data || {};
        super(data);
        this.requestorName = data.requestorName || '';
        this.reportReceiver = data.reportReceiver || '';
        this.hospital = data.hospital || '';
        this.department = data.department || '';
        this.variantsData = data.variantsData || [];
        this.uncoveredData = data.uncoveredData || [];
        this.resultsRiskResult = data.resultsRiskResult || '';
        this.matchResultData = data.matchResultData || {};
        this.woman = data.woman;
        this.man = data.man;
        this.showExtCodeSource = data.showExtCodeSource || false;
        this.showExtCodeTargets = data.showExtCodeTargets || false;
        this.request = new Request();
    }
}
