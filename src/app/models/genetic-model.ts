import { Ethnicity, Request, Translation } from './administrative-model';
import { DiseaseService } from '../services/genetic/disease.service';
import { environment } from '../../environments/environment';

// COMMON
export class Disease {
  // Constant values

  // Entity attributes
  id: number;
  omim: string;
  heredityPattern: string;
  translations: Array<Translation>;
  links: Array<string>;

  // View attributes
  nameView: string;

  // Linked resources
  genes: Array<Gene>;

  static fromObject(object: any): Disease {
    const disease = new Disease();
    disease.id = null;
    disease.omim = object.omim;
    disease.heredityPattern = object.heredityPattern;
    disease.translations = object.translations;
    disease.genes = object.genes;
    disease.links = object._links;
    disease.nameView = object.nameView;
    setIdFromLinks(disease);

    return disease;
  }

  getTableProperty(name: string): string {
    if (name === 'omim') {
      return this.omim;
    } else if (name === 'heredityPattern') {
      return this.heredityPattern;
    } else if (name === 'diseaseName') {
      return this.nameView;
    }
  }

  getName(currentLang: string): string {
    let result = '';
    this.translations.forEach (element => {
        if (element !== null
                && element !== undefined
                && element.language !== null
                && element.language !== undefined
                && currentLang !== null
                && currentLang !== undefined
                && element.language.toLowerCase() === currentLang.toLowerCase()) {
            result = element.name;
        }
    });
    return result;
  }
}

export class Genotype {
  // Constant values

  // Entity attributes
  cnvMetrics: CnvMetrics;
  coverage: number;
  polyTTract: PolyTTract;
  // cnvMetrics: ;

  // View attributes

  // Linked resources
  foundMutations: Array<FoundMutation>;
  relevantMutations: Array<FoundMutation>;
  uncoveredMutations: Array<UncoveredMutation>;
  noNgsMutations: Array<NoNgsMutation>;
  risks: Array<StudiedMutation>;
  cnvs: Array<CnvRequest>;
  uncoveredCnvs: Array<CnvRequest>;
  externalGenes: ExternalRequestGene;

  '_links': {
    self: { href: string },
    'precon:found-mutations': { href: string },
    'precon:relevant-found-mutations': { href: string },
    'precon:uncovereds': { href: string },
    'precon:no-ngs': { href: string },
    'precon:risks': { href: string },
    'precon:cnvs': { href: string },
    'precon:uncovered-cnvs': { href: string },
    'precon:external-genes': { href: string }
  };

  static fromObject(object: any): Genotype {
      const result: Genotype = new Genotype();
      result.coverage = object.coverage;
      result.polyTTract = object.polyTTract;
      result.cnvMetrics = object.cnvMetrics;
      result._links = object._links;
      return result;
  }
}

export class GenotypeObservable {
  foundMutationsData: Array<FoundMutation>;
  uncoveredMutationsData: Array<UncoveredMutation>;
  noNgsMutationsData: Array<NoNgsMutation>;
  risksData: Array<StudiedMutation>;
  cnvsData: Array<CnvRequest>;
  uncoveredCnvsData: Array<CnvRequest>;
  externalGenesData: ExternalRequestGene;
}

export class Mutation {
  id: number;
  accession: string;
  hgvs: string;
  panelVersion: number;
  chromosome: string;
  dbType: string;
  dbVersion: string;
  type: string;
  active: boolean;
  startPos: number;
  endPos: number;
  references: string;
  special: boolean;
  show: boolean;
  links: Array<string>;

  geneName: string;

  '_links': {
    self: { href: string },
    first: { href: string },
    last: { href: string },
    next: { href: string },
    previous: { href: string },
    search: { href: string },
    'precon:mutation-gene': { href: string }
  };

  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };

  static fromObject(object: any): Mutation {
    const mutation = new Mutation();
    mutation.accession = object.accession;
    mutation.hgvs = object.hgvs;
    mutation.panelVersion = object.panelVersion;
    mutation.chromosome = object.chromosome;
    mutation.dbType = object.dbType;
    mutation.dbVersion = object.dbVersion;
    mutation.type = object.type;
    mutation.active = object.active;
    mutation.startPos = object.startPos;
    mutation.endPos = object.endPos;
    mutation.references = object.references;
    mutation.special = object.special;
    mutation.show = object.show;
    mutation._links = object._links;
    mutation.page = object.page;
    setIdFromLinks(mutation);

    return mutation;
  }

  getTableProperty(name: string): string {
    if (name === 'accession') {
      return this.accession;
    } else if (name === 'geneName') {
      return this.geneName;
    } else if (name === 'hgvs') {
      return this.hgvs;
    } else if (name === 'chromosome') {
      return this.chromosome;
    } else if (name === 'references') {
      return this.references;
    } else if (name === 'active') {
      return String(this.active);
    } else if (name === 'panelVersion') {
      return String(this.panelVersion);
    } else if (name === 'dbType') {
      return this.dbType;
    } else if (name === 'dbVersion') {
      return this.dbVersion;
    } else if (name === 'type') {
      return this.type;
    } else if (name === 'startPos') {
      return String(this.startPos);
    } else if (name === 'endPos') {
      return String(this.endPos);
    }
  }
}

export class FoundMutation {
  // Constant values

  // Entity attributes
  id: number;
  disease: Disease;
  chromosome: string;
  geneName: string;
  exonNumber: string;
  intronNumber: string;
  hgvs: string;
  mutationType: string;
  transcript: string;
  references: string;
  type: string;
  tag: string;
  category: string;

  // View attributes

  // Linked resources
  '_links': {
    self: { href: string },
    first: { href: string },
    last: { href: string },
    next: { href: string },
    previous: { href: string },
    search: { href: string }
  };

  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };

  static fromObject(object: any): FoundMutation {
    const foundMutation = new FoundMutation();

    foundMutation.id = object.id;
    foundMutation.disease = object.disease;
    foundMutation.chromosome = object.chromosome;
    foundMutation.geneName = object.geneName;
    foundMutation.exonNumber = object.exonNumber;
    foundMutation.intronNumber = object.intronNumber;
    foundMutation.hgvs = object.hgvs;
    foundMutation.mutationType = object.mutationType;
    foundMutation.transcript = object.transcript;
    foundMutation.references = object.references;
    foundMutation.type = object.type;
    foundMutation.tag = object.tag;
    foundMutation.category = object.category;
    foundMutation._links = object._links;
    foundMutation.page = object.page;
    setIdFromLinks(foundMutation);

    return foundMutation;
  }

  getTableProperty(name: string): string {
    if (name === 'geneName') {
      if (this.geneName !== undefined) {
        return this.geneName;
      } else {
        return '';
      }
    } else if (name === 'hgvs') {
      if (this.hgvs !== undefined) {
        return this.hgvs;
      } else {
        return '';
      }
    } else if (name === 'chromosome') {
      if (this.chromosome !== undefined) {
        return this.chromosome;
      } else {
        return '';
      }
    } else if (name === 'references') {
      if (this.references !== undefined) {
        return this.references;
      } else {
        return '';
      }
    } else if (name === 'id') {
      if (this.id !== undefined) {
        return this.id.toString();
      } else {
        return '';
      }
    } else if (name === 'exonNumber') {
      if (this.exonNumber !== undefined) {
        return this.exonNumber;
      } else {
        return '';
      }
    } else if (name === 'intronNumber') {
      if (this.intronNumber !== undefined) {
        return this.intronNumber;
      } else {
        return '';
      }
    } else if (name === 'hgvs') {
      if (this.hgvs !== undefined) {
        return this.hgvs;
      } else {
        return '';
      }
    } else if (name === 'mutationType') {
      if (this.mutationType !== undefined) {
        return this.mutationType;
      } else {
        return '';
      }
    } else if (name === 'transcript') {
      if (this.transcript !== undefined) {
        return this.transcript;
      } else {
        return '';
      }
    } else if (name === 'references') {
      if (this.references !== undefined) {
        return this.references;
      } else {
        return '';
      }
    } else if (name === 'type') {
      if (this.type !== undefined) {
        return this.type;
      } else {
        return '';
      }
    } else if (name === 'tag') {
      if (this.tag !== undefined) {
        return this.tag;
      } else {
        return '';
      }
    } else if (name === 'category') {
      if (this.category !== undefined) {
        return this.category;
      } else {
        return '';
      }
    }
  }
}

export class UncoveredMutation {
  // Constant values

  // Entity attributes
  disease: Disease;
  chromosome: string;
  geneName: string;
  exonNumber: string;
  intronNumber: string;
  hgvs: string;
  mutationType: string;
  transcript: string;
  references: string;

  // View attributes

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

  static fromObject(object: any): UncoveredMutation {
      const uncovered = new UncoveredMutation();
      uncovered.disease = object.disease;
      uncovered.chromosome = object.chromosome;
      uncovered.geneName = object.geneName;
      uncovered.exonNumber = object.exonNumber;
      uncovered.intronNumber = object.intronNumber;
      uncovered.hgvs = object.hgvs;
      uncovered.mutationType = object.mutationType;
      uncovered.transcript = object.transcript;
      uncovered.references = object.references;
      uncovered._links = object._links;
      return uncovered;
    }
}

export class NoNgsMutation {
  // Constant values

  // Entity attributes
  diseaseName: string;
  omim: string;
  chromosome: string;
  geneName: string;
  geneRegion: string;
  mutation: string;
  expansion: string;
  mutationType: string;
  refSequence: string;
  references: string;
  agg: number;
  percentage: number;

  // View attributes

  // Linked resources
  gene: CommonGene;

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

  static fromObject(object: any): NoNgsMutation {
    const noNgs = new NoNgsMutation();

    noNgs.diseaseName = object.diseaseName;
    noNgs.omim = object.omim;
    noNgs.chromosome = object.chromosome;
    noNgs.geneName = object.geneName;
    noNgs.geneRegion = object.geneRegion;
    noNgs.mutation = object.mutation;
    noNgs.expansion = object.expansion;
    noNgs.mutationType = object.mutationType;
    noNgs.refSequence = object.refSequence;
    noNgs.references = object.references;
    noNgs.agg = object.agg;
    noNgs.percentage = object.percentage;
    noNgs._links = object._links;

    return noNgs;
  }

  getTableProperty(name: string): string {
    if (name === 'diseaseName') {
      if (this.diseaseName !== undefined) {
        return this.diseaseName;
      } else {
        return '';
      }
    } else if (name === 'omim') {
      if (this.omim !== undefined) {
        return this.omim;
      } else {
        return '';
      }
    } else if (name === 'chromosome') {
      if (this.chromosome !== undefined) {
        return this.chromosome;
      } else {
        return '';
      }
    } else if (name === 'geneName') {
      if (this.geneName !== undefined) {
        return this.geneName;
      } else {
        return '';
      }
    } else if (name === 'geneRegion') {
      if (this.geneRegion !== undefined) {
        return this.geneRegion.toString();
      } else {
        return '';
      }
    } else if (name === 'mutation') {
      if (this.mutation !== undefined) {
        return this.mutation;
      } else {
        return '';
      }
    } else if (name === 'expansion') {
      if (this.expansion !== undefined) {
        return this.expansion;
      } else {
        return '';
      }
    } else if (name === 'mutationType') {
      if (this.mutationType !== undefined) {
        return this.mutationType;
      } else {
        return '';
      }
    } else if (name === 'refSequence') {
      if (this.refSequence !== undefined) {
        return this.refSequence;
      } else {
        return '';
      }
    } else if (name === 'references') {
      if (this.references !== undefined) {
        return this.references;
      } else {
        return '';
      }
    } else if (name === 'agg') {
      if (this.agg !== undefined && this.agg !== null) {
        return this.agg.toString();
      } else {
        return '';
      }
    } else if (name === 'percentage') {
      if (this.percentage !== undefined && this.percentage !== null) {
        return this.percentage.toString();
      } else {
        return '';
      }
    }
  }
}

export class NoNgsAcceptedValues {
  disease: string;
  geneName: string;
  geneRegion: string;
  mutation: string;
  mutationType: string;
  agg: boolean;
  percentage: boolean;
  omim: string;
  chromosome: string;
}

export class StudiedMutation {
  // Constant values

  // Entity attributes
  geneName: string;
  carrierRate: string;
  carrierRateMax: string;
  carrierRateMin: string;
  residualRisk: string;
  '_links': Array<string>;

  // View attributes

  // Linked resources
  disease: Disease;
  ethnicity: Ethnicity;

  static fromObject(object: any): StudiedMutation {
      const result: StudiedMutation = new StudiedMutation();
      result.geneName = object.geneName;
      result.carrierRate = object.carrierRate;
      result.carrierRateMax = object.carrierRateMax;
      result.carrierRateMin = object.carrierRateMin;
      result.residualRisk = object.residualRisk;
      result._links  = object._links;
      return result;
  }
}

export class CnvRequest {
  // Constant values
  id: number;
  // Entity attributes
  copyNumber: number;
  meanCoverage: number;
  logRatio: number;
  tag: string;
  comment: string;
  positive: boolean;
  active: boolean;
  geneName: string;
  panelVersion: number;
  location: string;
  transcript: string;
  exonNumber: number;
  chromosome: string;
  startPos: number;
  endPos: number;
  show: boolean;
  links: Array<string>;
  type: string;

  '_links': {
      self: { href: string; },
      first: { href: string; },
      last: { href: string; },
      next: { href: string; },
      previous: { href: string; },
      search: { href: string; },
      'precon:gene': { href: string }
    };

    page: {
      size: number,
      totalElements: number,
      totalPages: number,
      number: number
    };

  // View attributes

  // Linked resources
  static fromObject(object: any): CnvRequest {
    const result: CnvRequest = new CnvRequest();
    result.copyNumber = object.copyNumber;
    result.meanCoverage = object.meanCoverage;
    result.logRatio = object.logRatio;
    result.tag = object.tag;
    result.comment = object.comment;
    result.positive = object.positive;
    result.active = object.active;
    result.geneName = object.geneName;
    result.panelVersion = object.panelVersion;
    result.location = object.location;
    result.transcript = object.transcript;
    result.exonNumber = object.exonNumber;
    result.chromosome = object.chromosome;
    result.startPos = object.startPos;
    result.endPos = object.endPos;
    result.show = object.show;
    result._links = object._links;
    result.type = object.type;
    setIdFromLinks(result);
    return result;
  }


  getTableProperty(name: string): string {
    if (name === 'copyNumber') {
      if (this.copyNumber !== undefined) {
        return String(this.copyNumber);
      } else {
        return '';
      }
    } else if (name === 'meanCoverage') {
      if (this.meanCoverage !== undefined) {
        return String(this.meanCoverage);
      } else {
        return '';
      }
    } else if (name === 'logRatio') {
      if (this.logRatio !== undefined) {
        return String(this.logRatio);
      } else {
        return '';
      }
    } else if (name === 'tag') {
      if (this.tag !== undefined) {
        return this.tag;
      } else {
        return '';
      }
    } else if (name === 'comment') {
      if (this.comment !== undefined) {
        return this.comment;
      } else {
        return '';
      }
    } else if (name === 'positive') {
      if (this.positive !== undefined) {
        return String(this.positive);
      } else {
        return '';
      }
    } else if (name === 'active') {
      if (this.active !== undefined) {
        return String(this.active);
      } else {
        return '';
      }
    } else if (name === 'geneName') {
      if (this.geneName !== undefined) {
        return this.geneName;
      } else {
        return '';
      }
    } else if (name === 'panelVersion') {
      if (this.panelVersion !== undefined) {
        return String(this.panelVersion);
      } else {
        return '';
      }
    } else if (name === 'location') {
      if (this.location !== undefined) {
        return this.location;
      } else {
        return '';
      }
    } else if (name === 'transcript') {
      if (this.transcript !== undefined) {
        return this.transcript.toString();
      } else {
        return '';
      }
    } else if (name === 'exonNumber') {
      if (this.exonNumber !== undefined && this.exonNumber !== null) {
        return String(this.exonNumber);
      } else {
        return '';
      }
    } else if (name === 'chromosome') {
      if (this.chromosome !== undefined) {
        return this.chromosome.toString();
      } else {
        return '';
      }
    } else if (name === 'startPos') {
      if (this.startPos !== undefined) {
        return this.startPos.toString();
      } else {
        return '';
      }
    } else if (name === 'endPos') {
      if (this.endPos !== undefined) {
        return this.endPos.toString();
      } else {
        return '';
      }
    } else if (name === 'show') {
      if (this.show !== undefined) {
        return this.show.toString();
      } else {
        return '';
      }
    }
  }
}

export class ExternalRequestGene {
  // Constant values

  // Entity attributes
  id: number;
  geneName: string;
  finalName: string;
  hgncId: string;
  chromosome: string;
  aliases: Array<any>;

  // View attributes


  // Linked resources
  request: Request;
  gene: CommonGene;

  getTableProperty(name: string): string {
    if (name === 'geneName') {
      return this.geneName;
    } else if (name === 'finalName') {
      return this.finalName;
    } else if (name === 'hgncId') {
      return this.hgncId;
    } else  if (name === 'chromosome') {
      return this.chromosome;
    } else if (name === 'aliases') {
      let display = '';
      for (const alias of this.aliases) {
        display = display + '  ' + alias;
      }
      return display;
    }
  }
}

export class MatchResult {
  // Constant values

  // Entity attributes
  forbiddenMatch: boolean;
  srcPanelVersion: number;
  srcHgmdVersion: string;
  srcClinvarVersion: string;
  srcDbVersions: Array<string>;
  tgtPanelVersion: number;
  tgtHgmdVersion: string;
  tgtClinvarVersion: string;
  tgtDbVersions: Array<string>;
  compatible: boolean;
  manualCompatible: boolean;
  matchResultWarnings: Array<string>;
  '_links': Array<string>;

  // View attributes

  // Linked resources
  sourceRequest: Request;
  targetRequest: Request;
  genes: Array<CommonGene>;
  uncoveredGenes: Array<CommonGene>;
  xChromoCnvs: Array<CnvRequest>;
  xChromoExternalGenes: Array<CommonGene>;
  xChromoMutations: Array<FoundMutation>;
  xChromoNoNgsMutations: Array<NoNgsMutation>;
  xChromoUncoveredCnvs: Array<CnvRequest>;
  xChromoUncoveredMutations: Array<UncoveredMutation>;
}

export class GeneAlias {
  name: string;
  ensemblGeneName: string;
}

export class Gene {
  // Constant values

  // Entity attributes
  id: number;
  geneName: string;
  finalName: string;
  panel: boolean;
  hgncId: string;
  chromosome: string;
  aliases: Array<GeneAlias>;
  links: Array<string>;

  '_links': {
    self: { href: string },
    'precon:diseases': { href: string }
  };

  static fromObject(object: any): Gene {
    const gene = new Gene();
    gene.geneName = object.geneName;
    gene.finalName = object.finalName;
    gene.panel = object.panel;
    gene.hgncId = object.hgncId;
    gene.chromosome = object.chromosome as string;
    gene.aliases = object.aliases;
    gene.links = object._links;
    setIdFromLinks(gene);
    return gene;
  }

  static fromArray(array: Array<object>, diseaseService: DiseaseService, objectKey: string = null): Array<Gene> {
    const result: Array<Gene> = new Array<Gene>();
    array.forEach(element => {
      const gene: Gene = element as Gene;
      result.push(gene);
    });
    return result;
  }

  // View attributes

  // Linked resources

  getTableProperty(name: string): string {
    if (name === 'geneName') {
        return this.geneName;
    } else if (name === 'finalName') {
      if (this.finalName !== undefined) {
        return this.finalName;
      } else {
        return '';
      }
    } else if (name === 'chromosome') {
      if (this.chromosome !== undefined) {
        return this.chromosome;
      } else {
        return '';
      }

    } else if (name === 'hgncId') {
      if (this.hgncId !== undefined) {
        return this.hgncId;
      } else {
        return '';
      }
    } else if (name === 'aliases') {
      if (this.aliases !== undefined) {
        let aliases = '';
        for (const alias of this.aliases) {
          aliases = aliases + '   ' + alias.name;
        }
        return aliases;
      }
    } else if (name === 'panel') {
        return String(this.panel);
    }
  }
}

export class CommonGene {
  // Constant values
  id: number;
  // Entity attributes
  geneName: string;

  '_links': Array<string>;

  // View attributes

  // Linked resources
  sourceFoundMutations: Array<FoundMutation>;
  sourceCnvs: Array<CnvRequest>;
  sourceNoNgs: Array<NoNgsMutation>;
  sourceUncoveredMutations: Array<UncoveredMutation>;
  sourceUncoveredCnvs: Array<CnvRequest>;
  sourceExternalGenes: Array<CommonGene>;

  targetFoundMutations: Array<FoundMutation>;
  targetCnvs: Array<CnvRequest>;
  targetNoNgs: Array<NoNgsMutation>;
  targetUncoveredMutations: Array<UncoveredMutation>;
  targetUncoveredCnvs: Array<CnvRequest>;
  targetExternalGenes: Array<CommonGene>;
}

export class Rule {
  // Constant values

  // Entity attributes
  name: string;

  // View attributes

  // Linked resources
  ruleConditionGroupA: Array<Condition>;
  ruleConditionGroupB: Array<Condition>;
  conditionGroupACoincidence: string;
  conditionGroupBCoincidence: string;
  actions: Array<Action>;

  '_links': {
    self: { href: string },
    'precon:ruleConditionGroupA': { href: string },
    'precon:ruleConditionGroupB': { href: string },
    'precon:actions': { href: string }
  };

  static fromObject(object: any): Rule {
    const result: Rule = new Rule();
    result.name = object.name;
    result._links = object._links;
    return result;
  }

  getTableProperty(name: string): string {
    if (name === 'name') {
      if (this.name !== undefined) {
        return this.name;
      }
    }
  }

}

export class RuleConditionGroup {
  coincidenceType: string;

  '_links': {
    self: { href: string },
    'precon:conditions': { href: string }
  };
}

export class Condition {
  CONDITION_TYPE_CARRIER_GENE: 'carrierGene';
  CONDITION_TYPE_CNV: 'cnv';
  CONDITION_TYPE_CONTAINS: 'contains';
  CONDITION_TYPE_NO_NGS: 'nongs';
  CONDITION_TYPE_PANEL: 'panel';
  CONDITION_TYPE_EMPTY_POLYTTRACT: 'emptyPolyTTract';
  CONDITION_TYPE_POLYTTRACT: 'polyTTract';
  CONDITION_TYPE_VARIANT: 'variant';

  // Constant values

  // Entity attributes
  type: string;
  uncovered: boolean;

  // CNV Condition fields
  copies: number;
  transcript: string;
  positive: boolean;
  active: boolean;

  // Contains condition fields
  targetGenesType: string;
  oppositeGenesType: string;
  conditionType: string;

  // No NGS condition fields
  geneRegion: string;
  mutation: string;

  // Panel condition fields
  panelVersion: number;

  // Empty Poly T Tract Condition fields

  // Poly T Tract Condition fields
  values: Array<string>;
  valuesView: string;

  // Variant Condition fields
  hgvs: string;

  // View attributes

  // Linked resources
  genes: Array<Gene>;

  '_links': {
    self: { href: string },
    'precon:group': { href: string },
    'precon:genes': { href: string },
    'precon:gene': { href: string }
  };

  static fromObject(object: any): Condition {
    const condition = new Condition();
    condition.type = object.type;
    condition.uncovered = object.uncovered;
    condition.hgvs = object.hgvs;
    condition.geneRegion = object.geneRegion;
    condition._links = object._links;
    return condition;
  }

  getTableProperty(name: string): string {
    if (name === 'type' && this.type !== undefined) {
      return this.type;
    } else if (name === 'copies' && this.copies !== undefined) {
      return this.copies + '';
    } else if (name === 'transcript' && this.transcript !== undefined) {
      return this.transcript;
    } else if (name === 'positive' && this.positive !== undefined) {
      if (this.positive) {
        return 'true';
      } else {
        return 'false';
      }
    } else if (name === 'active' && this.active !== undefined) {
      if (this.active) {
        return 'true';
      } else {
        return 'false';
      }
    } else if (name === 'targetGenesType' && this.targetGenesType !== undefined) {
      return this.targetGenesType;
    } else if (name === 'oppositeGenesType' && this.oppositeGenesType !== undefined) {
      return this.oppositeGenesType;
    } else if (name === 'uncovered' && this.uncovered !== undefined) {
      if (this.uncovered) {
        return 'true';
      } else {
        return 'false';
      }
    } else if (name === 'values' && this.values !== undefined) {
      let valuesString = '';
      for (const value of this.values) {
        valuesString = valuesString + ' ' + value;
      }
      return valuesString;
    } if (name === 'panelVersion' && this.panelVersion !== undefined) {
      return this.panelVersion + '';
    } if (name === 'hgvs' && this.hgvs !== undefined) {
      return this.hgvs;
    } else  if (name === 'geneRegion' && this.geneRegion !== undefined) {
      return this.geneRegion;
    } else if (name === 'genes' && this.genes !== undefined) {
      let geneString = '';
      for (const gene of this.genes) {
        geneString = geneString + ' ' + gene.geneName;
      }
      console.log('RECOVERING GENES: ' + geneString);
      return geneString;
    }
  }
}

export class Action {
// Constant values
  typeNotMatcheable: 'notMacheable';
  typeNotSuitableGenes: 'notSuitableGenes';
  typeWarning: 'warning';
  typeXChromo: 'xChromo';
  typeXChromoNoNgs: 'xChromoNoNgs';

// Entity attributes
  type: string;
  uncovered: boolean;
  hgvs: string;
  geneRegion: string;

// View attributes

// Linked resources
  genes: Array<CommonGene>;
  genesList: string;
  gene: CommonGene;
  ruleMatchResultWarning: Array<Translation>;
  ruleMatchResultWarningView: string;

  '_links': {
    self: { href: string },
    'precon:gene': { href: string }
  };

  static fromObject(object: any): Action {
    const action = new Action();
    action.type = object.type;
    action.uncovered = object.uncovered;
    action.hgvs = object.hgvs;
    action.geneRegion = object.geneRegion;
    action._links = object._links;
    return action;
  }

  getTableProperty(name: string): string {
    if (name === 'type') {
      return this.type;
    } else if (name === 'uncovered') {
      if (this.uncovered) {
        return 'true';
      } else {
        return 'false';
      }
    } else if (name === 'hgvs') {
      return this.hgvs;
    } else  if (name === 'geneRegion') {
      return this.geneRegion;
    }
  }
}

export class MatchTrack {
  // Constant values

  // Entity attributes
  total: number;
  completed: number;
  finished: boolean;
  customer: string;
  launched: string;
  error: boolean;

  // View attributes

  // Linked resources
  request: Request;
}

export class Page {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export class Links {
  curies: Array<object>;
  first: {href: string};
  last: {href: string};
  self: {href: string};
}

export class ApiRequest<T> {
  page: Page;
  '_embedded': {
    href?: Array<T>
  };
  '_links': Links;
}

function setIdFromLinks(obj: any): void {
    if (obj !== null
        && obj !== undefined
        && obj.links !== null
        && obj.links !== undefined
        && obj.links[environment.self] !== null
        && obj.links[environment.self] !== undefined) {
    const url = obj.links[environment.self][environment.href];
    try {
        const id: string = url.substr(url.lastIndexOf('/') + 1, url.length);
        obj.id = Number(id);
    } catch (e) {
        console.log('genetic-model::getDiseaseIdFromLinks - Error obtaining disease id');
        console.log(e);
        }
    }
}

export class PolyTTract {
  maxDepth: number;
  meanCoverage: number;
  totalReads: number;
  truncated: number;
  tag: string;
  haplotypes: Array<Haplotype>;

  static fromObject(object: any): PolyTTract {
    const result: PolyTTract = new PolyTTract();
    result.maxDepth = object.maxDepth;
    result.meanCoverage = object.meanCoverage;
    result.totalReads = object.totalReads;
    result.truncated = object.truncated;
    result.tag = object.tag;
    result.haplotypes = object.haplotypes;
    return result;
  }
}

export class Haplotype {
  frequency: number;
  numReads: number;
  numT: number;
  numTG: number;

  static fromObject(object: any): Haplotype {
    const result: Haplotype = new Haplotype();
    result.frequency = object.frequency;
    result.numReads = object.numReads;
    result.numT = object.numT;
    result.numTG = object.numTG;
    return result;
  }
}

export class CnvMetrics {
  n: number;
  ncontrols: number;
  minRsquared: number;
  maxRsquared: number;
  meanRsquared: number;
  cnQ1: number;
  cnMedian: number;
  cnQ3: number;
  cnIqr: number;
  cnSnr: number;
  candidateCnvs: number;
  rejected: boolean;
}

