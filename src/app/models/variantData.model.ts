import { UncoveredData } from './uncoveredData.model';

export interface VariantData extends UncoveredData {
    region?: string;
    mutationType?: string;
    order?: any;
    reference?: string;
}
