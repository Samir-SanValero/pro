export class Template {
  // Constant values

  // Entity attributes
  name: string;
  version: number;
  companyName: string;
  companyAddress: string;
  companyPhones: string;
  companyElectronicAddress: string;

  individualFavourite = true;
  coupleFavourite = true;
  donorFavourite = true;

  // View attributes

  '_links': {
    self: { href: string; },
    'precon:left-image': { href: string; },
    'precon:right-image': { href: string; },
    'precon:lateral-image': { href: string; },
    'precon:background-image': { href: string; },
    'precon:signatures': { href: string; },
    'precon:template-favourites': { href: string; },
  };

  static fromObject(object: any): Template {
    const template = new Template();

    template.name = object.name;
    template.version = object.version;
    template.companyName = object.companyName;
    template.companyAddress = object.companyAddress;
    template.companyPhones = object.companyPhones;
    template.companyElectronicAddress = object.companyElectronicAddress;
    template._links = object._links;

    return template;
  }

  getTableProperty(name: string): string {
    if (name === 'name') {
      if (this.name !== undefined) {
        return this.name;
      } else {
        return '';
      }
    } else if (name === 'version') {
      if (this.version !== undefined) {
        return this.version + '';
      } else {
        return '';
      }
    } else if (name === 'companyName') {
      if (this.companyName !== undefined) {
        return this.companyName;
      } else {
        return '';
      }
    } else if (name === 'individualFavourite') {
      return String(this.individualFavourite);
    } else if (name === 'coupleFavourite') {
      return String(this.coupleFavourite);
    } else if (name === 'donorFavourite') {
      return String(this.donorFavourite);
    }
  }
}

export class Signature {
  // Constant values

  // Entity attributes
  name: string;
  position: number;
  rol: string;
  additionalInfo: string;

  // View attributes

  // Linked resources
  '_links': {
    self: { href: string; },
    'precon:image': { href: string; }
  };
}

export class TemplateFavourite {
  // Constant values

  // Entity attributes
  reportName: string;
  language: string;
  groupCode: string;

  // View attributes

  // Linked resources
  '_links': {
    self: { href: string; },
    'precon:report-name-options': { href: string; }
  };
}

export class AcceptedLanguage {
  code: string;

  '_links': {
    self: { href: string; }
  };
}

export class SampleType {
  value: string;

  '_links': {
    self: { href: string; }
  };
}

export class IndividualReportStatus {
  '_links': {
    self: { href: string; }
    'precon:language': { href: string; }
    'precon:template': { href: string; }
    'precon:download': { href: string; }
    'precon:accepted-languages': { href: string; }
    'precon:accepted-sample-types': { href: string; }
  };
}

export class CoupleMatchReportStatus {
  '_links': {
    self: { href: string; }
    'precon:language': { href: string; }
    'precon:template': { href: string; }
    'precon:download': { href: string; }
    'precon:accepted-languages': { href: string; }
    'precon:accepted-sample-types': { href: string; }
    'precon:accepted-genetic-risks': { href: string; }
  };
}

export class SomeDonorsReportStatus {
  '_links': {
    self: { href: string; }
    'precon:language': { href: string; }
    'precon:template': { href: string; }
    'precon:download': { href: string; }
    'precon:accepted-languages': { href: string; }
  };
}
