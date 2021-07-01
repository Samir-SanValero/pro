export class Person {

    name?: string;
    idCard?: string;
    birthDate?: string;
    ethnicity?: string;
    extRef?: string;
    urCode?: string;
    entranceDate?: string;
    country?: string;
    sampleType?: string;
    indication?: string;

    constructor(data?: any) {
        data = data || {};
        this.name = data.name || '';
        this.idCard = data.idCard || '';
        this.birthDate = data.birthDate || '';
        this.ethnicity = data.ethnicity || '';
        this.extRef = data.extRef || '';
        this.urCode = data.urCode || '';
        this.entranceDate = data.entranceDate || '';
        this.country = data.country || '';
        this.sampleType = data.sampleType || '';
        this.indication = data.indication || '';
    }
}
