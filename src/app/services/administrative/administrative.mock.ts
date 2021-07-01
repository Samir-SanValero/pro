import { Injectable } from '@angular/core';
import {
    Bank,
    Country,
    DonorRequest,
    Ethnicity,
    Group,
    MatchRequest,
    Permission,
    Request,
    Translation
} from '../../models/administrative-model';
import {MatchResult, NoNgsMutation} from '../../models/genetic-model';
import { HalObject } from '../../models/common-model';

/**
 * Use this class to mock values when
 * no backend connection is available.
 */

@Injectable({ providedIn: 'root' })
export class AdministrativeMock {

    constructor() {}

    public generateBankList(): Array<Bank> {
        const bankList = new Array<Bank>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

        for (const index of indexArray) {
            bankList.push(this.generateBank(index));
        }

        return bankList;
    }

    public generateBank(index: string): Bank {
        const bank: Bank = new Bank();

        bank.groupCode = 'groupCode' + index;
        bank.code = 'bankCode' + index;
        bank.name = 'bankName' + index;
        bank.description = 'description' + index;
        bank.active = true;
        bank.containsExternalRequests = true;

        bank._links = {
            self: { href: 'selfUrlBank' + index},
            first: { href: 'firstUrlBank' + index },
            last: { href: 'lastUrlBank' + index },
            next: { href: 'nextUrlBank' + index },
            previous: { href: 'previousUrlBank' + index },
            search: { href: 'searchUrlBank' + index }
        };

        return bank;
    }

    public generateGroupList(): Array<Group> {
        const groupList = new Array<Group>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            groupList.push(this.generateGroup(index));
        }

        return groupList;
    }

    public generateGroup(index: string): Group {
        const group: Group = new Group();

        group.id = 'groupCode' + index;
        group.name = 'groupName' + index;
        group.externalCode = 'groupExternalCode' + index;
        group.companyCode = 'groupCompanyCode' + index;
        group.companyName = 'groupCompanyName' + index;

        group._links = {
            self: { href: 'selfUrlBank' + index},
            first: { href: 'firstUrlBank' + index },
            last: { href: 'lastUrlBank' + index },
            next: { href: 'nextUrlBank' + index },
            previous: { href: 'previousUrlBank' + index },
            search: { href: 'searchUrlBank' + index }
        };

        return group;
    }

    public generateRequestList(): Array<Request> {
        console.log('Generate administrative list');

        const requestList = new Array<Request>();

        const indexArray = new Array(50);
        let currentIndex = 0;

        for (const index of indexArray) {
            currentIndex = currentIndex + 1;
            requestList.push(this.generateRequest(currentIndex.toString()));
        }
        console.log('Generated administrative list of ' + requestList.length);
        return requestList;
    }

    public generateRequest(index: string): Request {
        // console.log('generating request');

        const request: Request = new Request();

        request.firstName = Math.random().toString(36).substring(7);
        request.lastName = Math.random().toString(36).substring(7) + ' ' +  Math.random().toString(36).substring(7);
        request.idCard = 'NIF' + index;
        request.receptionDate = '2020-11-05T17:03:19.798+00:00' + index;
        request.startDate = '2020-11-05T17:03:19.798+00:00' + index;
        request.birthday = '2020-11-05T17:02:18.983+00:00' + index;
        request.chosenCounter = 0;
        request.female = true;
        request.extCode = Math.random().toString(36).substring(7) + index;
        request.groupCode = 'GROUP_CODE_' + index;
        request.urCode = 'UR' + index;
        request.external = false;
        request.blocked = true;
        request.validated = true;
        request.idCode = 'idCode' + index;
        request.active = true;
        request.typeIndividual = request.typeIndividualCouple;
        request.requestType = '';
        request.endDate = '2020-11-05T17:03:19.798+00:00';
        request.status = 'status';
        request.report = false;

        request.country = this.generateCountry('1');
        request.ethnicity = this.generateEthnicity('1');

        request.countryView = request.country.code;
        request.ethnicityView = request.ethnicity.name;

        request._links = {
            self: { href: '' },
            first: { href: '' },
            last: { href: '' },
            next: { href: '' },
            previous: { href: '' },
            search: { href: '' },
            'precon:match-requests': { href: '' },
            'precon:matchable-requests': { href: '' },
            'precon:matchable-banks': { href: '' },
            'precon:available-donor-groups': { href: '' },
            'precon:requested-donor-requests': { href: '' },
            'precon:partner': { href: '' },
            'precon:country': { href: '' },
            'precon:countries': { href: '' },
            'precon:ethnicity': { href: '' },
            'precon:donor-requests': { href: '' },
            'precon:ethnicities': { href: '' },
            'precon:genotype': { href: '' },
            'precon:download-gestlab-report': { href: '' }
        };

        return request;
    }

    public generateNoNgsMutationList(): Array<NoNgsMutation> {
        const mutationList = new Array<NoNgsMutation>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24',
            '25'
        ];

        for (const index of indexArray) {
            mutationList.push(this.generateNoNgsMutation(index));
        }

        return mutationList;
    }

    public generateNoNgsMutation(index: string): NoNgsMutation {
        const mutation: NoNgsMutation = new NoNgsMutation();

        mutation.diseaseName = 'diseaseName' + index;
        mutation.omim = 'omim' + index;
        mutation.chromosome = 'chromosome' + index;
        mutation.geneName = 'geneName' + index;
        mutation.geneRegion = 'geneRegion' + index;
        mutation.mutation = 'mutation' + index;
        mutation.expansion = 'expansion' + index;
        mutation.mutationType = 'mutationType' + index;
        mutation.refSequence = 'refSequence' + index;
        mutation.references = 'references' + index;
        mutation.agg = 1;
        mutation.percentage = 5;

        return mutation;
    }

    public generateTranslationList(): Array<Translation> {
        const translationList = new Array<Translation>();

        let translation = new Translation();

        translation.language = 'es';
        translation.name = 'Traducción';
        translationList.push(translation);

        translation = new Translation();
        translation.language = 'en';
        translation.name = 'Translation';
        translationList.push(translation);

        translation = new Translation();
        translation.language = 'de';
        translation.name = 'Aleman';
        translationList.push(translation);

        return translationList;
    }

    public generateTranslation(index: string): Translation {
        const translation: Translation = new Translation();

        translation.language = 'ES';
        translation.name = 'translationName' + index;

        return translation;
    }

    public generateMatchRequestList(): Array<MatchRequest> {
        const matchRequestList = new Array<MatchRequest>();

        const indexArray = [
            '1', '2', '3', '4', '5'];

        for (const index of indexArray) {
            matchRequestList.push(this.generateMatchRequest(index));
        }

        return matchRequestList;
    }

    public generateMatchRequest(index: string): MatchRequest {
        const matchRequest: MatchRequest = new MatchRequest();

        matchRequest.groupCode = 'matchRequestGroupCode' + index;
        matchRequest.matchVersion = 1;
        matchRequest.launchUser = 'launchUser';
        matchRequest.matchRequestDate = '2020-01-21';
        matchRequest.state = matchRequest.statusCreated;

        matchRequest._links =  {
            self: { href: index },
            'precon:request': { href: index },
            'precon:target-requests': { href: index },
            'precon:report': { href: index },
            'precon:match-results': { href: index },
            'precon:match-track': { href: index },
            'precon:some-donors-report-status': { href: index },
            'precon:receiver-some-donors-report-status': { href: index },
        };

        return matchRequest;
    }

    public generateMatchResultList(): Array<MatchResult> {
        const matchResultList = new Array<MatchResult>();

        const indexArray = [
            '1', '2', '3', '4', '5'];

        for (const index of indexArray) {
            matchResultList.push(this.generateMatchResult(index));
        }

        return matchResultList;
    }

    public generateMatchResult(index: string): MatchResult {
        const matchResult: MatchResult = new MatchResult();

        matchResult.forbiddenMatch = false;
        matchResult.srcPanelVersion = 1;
        matchResult.srcHgmdVersion = 'srcHgmdVersion' + index;
        matchResult.srcClinvarVersion = 'srcClinvarVersion' + index;
        matchResult.tgtPanelVersion = 1;
        matchResult.tgtHgmdVersion = 'tgtHgmdVersion' + index;
        matchResult.tgtClinvarVersion = 'tgtClinvarVersion' + index;
        matchResult.compatible = true;
        matchResult.manualCompatible = true;
        matchResult.matchResultWarnings = ['warning1', 'warning2'];

        return matchResult;
    }

    public generatePermissionList(): Array<Permission> {
        const permissionList = new Array<Permission>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            permissionList.push(this.generatePermission(index));
        }

        return permissionList;
    }

    public generatePermission(index: string): Permission {
        const permission: Permission = new Permission();

        permission.groupCode = 'permissionGroupCode' + index;
        permission.type = permission.typeMatch + index;
        permission.options = 'options' + index;
        permission.toGroupCode = '' + index;
        permission._links = [['']];

        return permission;
    }

    public generateCountryList(): Array<Country> {
        const countryList = new Array<Country>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            countryList.push(this.generateCountry(index));
        }

        return countryList;
    }

    public generateCountry(index: string): Country {
        const country: Country = new Country();

        country.code = 'countryCode' + index;
        country.translations = this.generateTranslationList();

        return country;
    }

    public generateEthnicityList(): Array<Ethnicity> {
        const ethnicityList = new Array<Ethnicity>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            ethnicityList.push(this.generateEthnicity(index));
        }

        return ethnicityList;
    }

    public generateEthnicity(index: string): Ethnicity {
        const ethnicity: Ethnicity = new Ethnicity();
        ethnicity.name = 'ethnicity' + index;
        ethnicity.translations = this.generateTranslationList();

        return ethnicity;
    }

    public generateDonorRequestList(): Array<DonorRequest> {
        const donorRequestList = new Array<DonorRequest>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            donorRequestList.push(this.generateDonorRequest(index));
        }

        return donorRequestList;
    }

    public generateDonorRequest(index: string): DonorRequest {
        const donorRequest: DonorRequest = new DonorRequest();

        donorRequest.requestedGroupCode = 'requestedGroupCode' + index;
        donorRequest.requestedGroupName = 'requestedGroupName' + index;
        donorRequest.requestedCompanyName = 'requestedCompanyName' + index;
        donorRequest.requestorGroupName = 'requestorGroupName' + index;
        donorRequest.requestorCompanyName = 'requestorCompanyName' + index;
        donorRequest.requestDate = '2020-01-21' + index;
        donorRequest.requestFinished = 'requestFinished' + index;
        donorRequest.comment = 'comment' + index;

        return donorRequest;
    }

    public generateHalObject(objectsPrefix: string, objects: Array<any>): HalObject {
        const halObject = new HalObject();

        halObject.page = {
            size: objects.length,
            totalElements: objects.length,
            totalPages: 1,
            number: 0
        };

        halObject._embedded = [];
        halObject._embedded[objectsPrefix] = objects;

        return halObject;
    }

}
