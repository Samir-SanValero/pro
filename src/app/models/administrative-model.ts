import { Genotype, MatchResult } from './genetic-model';

export class Bank {
  // Constant values

  // Entity attributes
  groupCode: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  containsExternalRequests: boolean;

  // View attributes
  groupName: string;

  // Linked resources
  requests: Array<Request>;
  matchableRequestsForRequest: Array<Request>;

  // Linked resources
  '_links': {
    self: { href: string; },
    first: { href: string; },
    last: { href: string; },
    next: { href: string; },
    previous: { href: string; },
    search: { href: string; }
  };

  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };

  static fromObject(object: any): Bank {
    const bank = new Bank();

    bank.groupCode = object.groupCode;
    bank.code = object.code;
    bank.name = object.name;
    bank.description = object.description;
    bank.active = object.active;
    bank.containsExternalRequests = object.containsExternalRequests;
    bank.requests = object.requests;
    bank.matchableRequestsForRequest = object.matchableRequestsForRequest;
    bank._links = object._links;

    return bank;
  }

  getTableProperty(name: string): string {
    if (name === 'active') {
      return String(this.active);
    } else if (name === 'code') {
      return this.code;
    } else if (name === 'groupCode') {
      return this.groupCode;
    } else if (name === 'name') {
      return this.name;
    } else if (name === 'groupName') {
      return this.groupName;
    }
  }
}

export class Group {
  // Constant values

  // Entity attributes
  id: string;
  name: string;
  externalCode: string;
  companyCode: string;
  companyName: string;

  // View attributes

  // Linked resources
  permissions: Array<Permission>;

  '_links': {
    self: { href: string; },
    first: { href: string; },
    last: { href: string; },
    next: { href: string; },
    previous: { href: string; },
    search: { href: string; }
  };

  static fromObject(object: any): Group {
    const group = new Group();

    group.id = object.id;
    group.name = object.name;
    group.externalCode = object.externalCode;
    group.companyCode = object.companyCode;
    group.companyName = object.companyName;

    return group;
  }

  getTableProperty(name: string): string {
    if (name === 'id') {
      if (this.id !== undefined) {
        return this.id;
      } else {
        return '';
      }
    } else if (name === 'name') {
      if (this.name !== undefined) {
        return this.name;
      } else {
        return '';
      }
    } else if (name === 'companyCode') {
      if (this.companyCode !== undefined) {
        return this.companyCode;
      } else {
        return '';
      }
    } else if (name === 'externalCode') {
      if (this.externalCode !== undefined) {
        return this.externalCode;
      } else {
        return '';
      }
    } else if (name === 'companyName') {
      if (this.companyName !== undefined) {
        return this.companyName;
      } else {
        return '';
      }
    }
  }
}

export class Permission {
  // Constant values
  typeDonor = 'PRECON_DONOR';
  typeMatch = 'PRECON_MATCH';
  typeKit = 'PRECON_KIT';
  typeExternalRequest = 'PRECON_EXT_REQUEST';
  typeRequestsBlocked = 'PRECON_REQUESTS_BLOCKED';
  typeBankLink = 'PRECON_BANK_LINK';

  // Entity attributes
  id: string;
  groupCode: string;
  groupName: string;
  type: string;
  options: string;
  toGroupCode: string;

  // View attributes

  // Linked resources
  '_links': any[];

  getTableProperty(name: string): string {
    if (name === 'permissionGroup') {
      if (this.groupName !== undefined) {
        return this.groupName;
      } else {
        return '';
      }
    } else if (name === 'permissionType') {
      if (this.type !== undefined) {
        return this.type;
      } else {
        return '';
      }
    } else if (name === 'permissionToGroup') {
      if (this.toGroupCode !== undefined) {
        return this.toGroupCode;
      } else {
        return '';
      }
    }
  }

  fromObject(object: any): Permission {
    const permission = new Permission();

    permission.id = object.id;
    permission.groupCode = object.groupCode;
    permission.type = object.type;
    permission.options = object.options;
    permission.toGroupCode = object.toGroupCode;

    return permission;
  }
}

export class Request {
  // Constant values
  typeIndividualDonor = 'DONOR';
  typeIndividualRecipient = 'RECIPIENT';
  typeIndividualCouple = 'COUPLE';
  typeIndividualSinglePerson = 'SINGLE_PERSON';

  typeIndividualDonorView = 'Donante';
  typeIndividualRecipientView = 'Receptor';
  typeIndividualCoupleView = 'Pareja';
  typeIndividualSinglePersonView = 'Individuo';

  // Entity attributes
  firstName: string;
  lastName: string;
  idCard: string;
  receptionDate: string;
  startDate: string;
  birthday: string;
  chosenCounter: number;
  female: boolean;
  extCode: string;
  groupCode: string;
  urCode: string;
  external: boolean;
  blocked: boolean;
  validated: boolean;
  idCode: string;
  active: boolean;
  typeIndividual: string;
  requestType: string;
  endDate: string;
  status: string;
  report: boolean;
  clientReference: string;

  // View attributes
  countryView: string;
  ethnicityView: string;

  // Linked resources
  matchRequests: Array<MatchRequest>;
  matchableRequests: Array<Request>;
  matchableBanks: Array<Bank>;
  availableDonorGroups: Array<Group>;
  requestedDonorRequests: Array<DonorRequest>;
  partner: Request;
  createdDonorRequests: Array<DonorRequest>;
  country: Country;
  ethnicity: Ethnicity;
  genotype: Genotype;
  gestLabreport: string;

  '_links': {
    self: { href: string; },
    first: { href: string; },
    last: { href: string; },
    next: { href: string; },
    previous: { href: string; },
    search: { href: string; },
    'precon:match-requests': { href: string },
    'precon:matchable-requests': { href: string },
    'precon:matchable-banks': { href: string },
    'precon:available-donor-groups': { href: string },
    'precon:requested-donor-requests': { href: string },
    'precon:partner': { href: string },
    'precon:country': { href: string },
    'precon:countries': { href: string },
    'precon:ethnicity': { href: string },
    'precon:donor-requests': { href: string },
    'precon:ethnicities': { href: string },
    'precon:genotype': { href: string },
    'precon:download-gestlab-report': { href: string }
  };

  static fromObject(object: any): Request {
      const request = new Request();

      request.firstName = object.firstName;
      request.lastName = object.lastName;
      request.idCard = object.idCard;
      request.receptionDate = object.receptionDate;
      request.startDate = object.startDate;
      request.birthday = object.birthday;
      request.chosenCounter = object.chosenCounter;
      request.female = object.female;
      request.extCode = object.extCode;
      request.groupCode = object.groupCode;
      request.urCode = object.urCode;
      request.external = object.external;
      request.blocked = object.blocked;
      request.validated = object.validated;
      request.idCode = object.idCode;
      request.active = object.active;
      request.typeIndividual = object.typeIndividual;
      request.requestType = object.requestType;
      request.endDate = object.endDate;
      request.status = object.status;
      request.report = object.report;
      request.countryView = object.countryView;
      request.ethnicityView = object.ethnicityView;
      request.matchRequests = object.matchRequests;
      request.matchableRequests = object.matchableRequests;
      request.matchableBanks = object.matchableBanks;
      request.availableDonorGroups = object.availableDonorGroups;
      request.requestedDonorRequests = object.requestedDonorRequests;
      request.partner = object.partner;
      request.createdDonorRequests = object.createdDonorRequests;
      request.country = object.country;
      request.ethnicity = object.ethnicity;
      request.genotype = object.genotype;
      request.gestLabreport = object.gestLabreport;
      request._links = object._links;

      return request;
    }

  getTableProperty(name: string): string {
    if (name === 'urCode') {
      return this.urCode;
    } else if (name === 'idCode') {
      return this.idCode;
    } else if (name === 'typeIndividual') {
      if (this.typeIndividual === this.typeIndividualDonor) {
        return this.typeIndividualDonorView;
      } else if (this.typeIndividual === this.typeIndividualRecipient) {
        return this.typeIndividualRecipientView;
      } else if (this.typeIndividual === this.typeIndividualCouple) {
        return this.typeIndividualCoupleView;
      } else if (this.typeIndividual === this.typeIndividualSinglePerson) {
        return this.typeIndividualSinglePersonView;
      }
    } else if (name === 'firstName') {
      return this.firstName;
    } else if (name === 'lastName') {
      return this.lastName;
    } else if (name === 'female') {
      if (this.female) {
        return 'Femenino';
      } else {
        return 'Masculino';
      }
    } else if (name === 'ethnicity') {
      if (this.ethnicity !== undefined) {
        return this.ethnicity.name;
      }
    } else if (name === 'country') {
      if (this.country !== undefined) {
        return this.country.code;
      }
    } else if (name === 'externalCode') {
      if (this.extCode !== undefined) {
        return this.extCode;
      }
    } else if (name === 'groupCode') {
      if (this.groupCode !== undefined) {
        return this.groupCode;
      }
    } else if (name === 'receptionDate') {
      if (this.receptionDate !== undefined) {
        return this.receptionDate;
      }
    } else if (name === 'startDate') {
      if (this.startDate !== undefined) {
        return this.startDate;
      }
    } else if (name === 'endDate') {
      if (this.endDate !== undefined) {
        return this.endDate;
      }
    } else if (name === 'status') {
      if (this.status !== undefined) {
        return this.status;
      }
    } else if (name === 'blocked') {
      if (this.blocked !== undefined) {
        return String(this.blocked);
      }
    } else if (name === 'active') {
      if (this.active !== undefined) {
        return String(this.active);
      }
    } else if (name === 'validated') {
      if (this.validated !== undefined) {
        return String(this.validated);
      }
    } else if (name === 'results') {
      if (this.matchRequests !== undefined) {
        return String(this.matchRequests.length);
      } else {
        return '0';
      }
    }
  }

  generatePatchJson(): Array<any> {
    return [
      {op: 'replace', path: '/firstName', value: this.firstName},
      {op: 'replace', path: '/lastName', value: this.lastName},
      {op: 'replace', path: '/idCard', value: this.idCard},
      {op: 'replace', path: '/receptionDate', value: this.receptionDate},
      {op: 'replace', path: '/startDate', value: this.startDate},
      {op: 'replace', path: '/birthday', value: this.birthday},
      {op: 'replace', path: '/chosenCounter', value: this.chosenCounter},
      {op: 'replace', path: '/female', value: this.female},
      {op: 'replace', path: '/extCode', value: this.extCode},
      {op: 'replace', path: '/groupCode', value: this.groupCode},
      {op: 'replace', path: '/urCode', value: this.urCode},
      {op: 'replace', path: '/blocked', value: this.blocked},
      {op: 'replace', path: '/validated', value: this.validated},
      {op: 'replace', path: '/idCode', value: this.idCode},
      {op: 'replace', path: '/active', value: this.active},
      {op: 'replace', path: '/typeIndividual', value: this.typeIndividual},
      {op: 'replace', path: '/requestType', value: this.requestType},
      {op: 'replace', path: '/endDate', value: this.endDate},
      {op: 'replace', path: '/status', value: this.status},
      {op: 'replace', path: '/report', value: this.report}
    ];
  }
}

export class MatchRequest {

  // Constant values
  statusCreated = 'CREATED';
  statusReadyToMatch = 'READY_TO_MATCH';
  statusLaunched = 'LAUNCHED';
  statusFinished = 'FINISHED';
  statusError = 'ERROR';

  groupCode: string;
  matchVersion: number;
  launchUser: string;
  matchRequestDate: string;
  matchExecutionDate: string;
  matchResults: Array<MatchResult>;
  report: string;
  state: string;

  '_links': {
    self: { href: string },
    'precon:request': { href: string },
    'precon:target-requests': { href: string },
    'precon:report': { href: string },
    'precon:match-results': { href: string },
    'precon:match-track': { href: string },
    'precon:some-donors-report-status': { href: string },
    'precon:receiver-some-donors-report-status': { href: string },
  };

  static fromObject(object: any): MatchRequest {
    const matchRequest = new MatchRequest();

    matchRequest.groupCode = object.groupCode;
    matchRequest.matchVersion = object.matchVersion;
    matchRequest.launchUser = object.launchUser;
    matchRequest.matchRequestDate = object.matchRequestDate;
    matchRequest.matchExecutionDate = object.matchExecutionDate;
    matchRequest.state = object.state;
    matchRequest._links = object._links;

    return matchRequest;
  }

  getTableProperty(name: string): string {
    if (name === 'groupCode') {
      return this.groupCode;
    } else if (name === 'matchVersion') {
      return this.matchVersion + '';
    } else  if (name === 'launchUser') {
      return this.launchUser;
    } else  if (name === 'matchRequestDate') {
      return this.matchRequestDate;
    } else  if (name === 'matchExecutionDate') {
      return this.matchExecutionDate;
    } else  if (name === 'state') {
      return this.state;
    }
  }
}

export class Country {
  // Constant values

  // Entity attributes
  code: string;
  translations: Array<Translation>;

  // View attributes
  viewTranslation: string;

  // Linked resources
  '_links': {
    self: { href: string; }
  };

  fromObject(object: any): Country {
    const country = new Country();

    country.code = object.code;
    country.translations = object.translations;
    country.viewTranslation = object.viewTranslation;

    country._links = object._links;

    return country;
  }
}

export class Ethnicity {
  // Constant values

  // Entity attributes
  name: string;
  translations: Array<Translation>;

  viewTranslation: string;

  // View attributes

  // Linked resources
  '_links': {
    self: { href: string; }
  };

  fromObject(object: any): Ethnicity {
    const ethnicity = new Ethnicity();

    ethnicity.name = object.code;
    ethnicity.translations = object.translations;
    ethnicity.viewTranslation = object.viewTranslation;

    ethnicity._links = object._links;

    return ethnicity;
  }
}

export class DonorRequest {
  // Constant values

  // Entity attributes
  requestedGroupCode: string;
  requestedGroupName: string;
  requestedCompanyName: string;
  requestorGroupName: string;
  requestorCompanyName: string;
  requestDate: string;
  requestFinished: string;
  comment: string;

  // View attributes

  // Linked resources
  request: Request;
  requestedGroup: Group;
}

export class Translation {
  // Constant values

  // Entity attributes
  name: string;
  language: string;
  description: string;

  // View attributes

  // Linked resources
}
