import { MatchResultWarnings } from './matchResultWarnings.model';
import { MatchSourceReport } from './matchSourceReport.model';
import { MatchTargetReports } from './matchTargetReports.model';

export class MatchResultData {

    matchSourceReport?: MatchSourceReport;
    matchTargetReports?: MatchTargetReports[];
    matchResultWarnings?: MatchResultWarnings[];
    constructor(data?: any) {
        data = data || {};
        this.matchSourceReport = data.matchSourceReport || {};
        this.matchTargetReports = data.matchTargetReports || [];
        this.matchResultWarnings = data.matchResultWarnings || [];
    }
}
