import { Injectable } from '@angular/core';
import { AdministrativeMock } from '../administrative/administrative.mock';
import {AcceptedLanguage, SampleType, Signature, Template} from '../../models/report-model';

@Injectable({ providedIn: 'root' })
export class ReportMock {

    constructor(public administrativeMock: AdministrativeMock) { }

    public generateSampleTypes(): Array<SampleType> {
        let sampleList = new Array<SampleType>();

        let sampleType = new SampleType();
        sampleType.value = 'Sangre periférica (EDTA)';
        sampleType._links = {
            self: { href: 'http://localhost:8080/precon/api/languages/es'},
        };
        sampleList.push(sampleType);

        sampleType = new SampleType();
        sampleType.value = 'ADN';
        sampleType._links = {
            self: { href: 'http://localhost:8080/precon/api/languages/en'},
        };
        sampleList.push(sampleType);

        return sampleList;
    }

    public generateAcceptedLanguages(): Array<AcceptedLanguage> {
        let languageList = new Array<AcceptedLanguage>();

        let language = new AcceptedLanguage();
        language.code = 'es';
        language._links = {
            self: { href: 'http://localhost:8080/precon/api/languages/es'},
        };
        languageList.push(language);

        language = new AcceptedLanguage();
        language.code = 'en';
        language._links = {
            self: { href: 'http://localhost:8080/precon/api/languages/en'},
        };
        languageList.push(language);

        return languageList;
    }

    public generateTemplateList(): Array<Template> {
        const foundMutationList = new Array<Template>();
        const indexArray = ['1', '2', '3', '4', '5'];
        for (const index of indexArray) {
            foundMutationList.push(this.generateTemplate(index));
        }
        return foundMutationList;
    }

    public generateTemplate(index: string): Template {
        const template: Template = new Template();
        template.name = 'name' + index;
        template.version = 1;
        template.companyName = 'companyName' + index;
        template.companyAddress = 'companyAddress' + index;
        template.companyPhones = 'companyPhones' + index;
        template.companyElectronicAddress = 'companyElectronicAddress' + index;
        template._links = {
            self: { href: 'http://localhost:8080/api/templates/' + index },
            'precon:left-image': { href: 'http://localhost:8080/api/templates/' + index + '/image/left_image' },
            'precon:right-image': { href: 'http://localhost:8080/api/templates/' + index + '/image/right_image' },
            'precon:lateral-image': { href: 'http://localhost:8080/api/templates/' + index + '/image/right_image' },
            'precon:background-image': { href: 'http://localhost:8080/api/templates/' + index + '/image/background_image' },
            'precon:signatures': { href: 'http://localhost:8080/api/signatures/template/' + index },
            'precon:template-favourites': { href: 'http://localhost:8080/api/templates/' + index + '/templateFavourites' },
        };
        return template;
    }

    public generateSignatureList(): Array<Signature> {
        const foundMutationList = new Array<Signature>();
        const indexArray = ['1', '2', '3', '4', '5'];
        for (const index of indexArray) {
            foundMutationList.push(this.generateSignature(index));
        }
        return foundMutationList;
    }

    public generateSignature(index: string): Signature {
        const signature: Signature = new Signature();
        signature.name = 'name' + index;
        signature.position = 1;
        signature.rol = 'rol' + index;
        signature.additionalInfo = 'additionalInfo' + index;
        signature._links = {
            self: { href: 'http://localhost:8080/api/templates/' + index },
            'precon:image': { href: 'http://localhost:8080/api/templates/' + index + '/image/left_image' }
        };
        return signature;
    }
}
