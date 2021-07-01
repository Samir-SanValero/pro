import { Injectable } from '@angular/core';
import {
    Action, CnvMetrics,
    CnvRequest,
    CommonGene, Condition,
    Disease,
    ExternalRequestGene,
    FoundMutation, Gene, GeneAlias, Genotype, Haplotype,
    MatchTrack, Mutation, NoNgsMutation, PolyTTract, Rule, RuleConditionGroup, StudiedMutation, UncoveredMutation
} from '../../models/genetic-model';
import { Translation } from '../../models/administrative-model';
import { AdministrativeMock } from '../administrative/administrative.mock';

@Injectable({ providedIn: 'root' })
export class GeneticMock {

    constructor(public administrativeMock: AdministrativeMock) { }

    public generateFoundMutationList(): Array<FoundMutation> {
        const foundMutationList = new Array<FoundMutation>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            foundMutationList.push(this.generateFoundMutation(index));
        }

        return foundMutationList;
    }

    public generateFoundMutation(index: string): FoundMutation {
        const foundMutation: FoundMutation = new FoundMutation();

        foundMutation.disease = this.generateDisease(index);
        foundMutation.chromosome = 'chromosome' + index;
        foundMutation.geneName = 'geneName' + index;
        foundMutation.exonNumber = 'exonNumber' + index;
        foundMutation.intronNumber = 'intronNumber' + index;
        foundMutation.hgvs = 'hgvs' + index;
        foundMutation.mutationType = 'mutationType' + index;
        foundMutation.transcript = 'transcript' + index;
        foundMutation.references = 'references' + index;
        foundMutation.type = 'type' + index;
        foundMutation.tag = 'tag' + index;
        foundMutation.category = 'category' + index;
        foundMutation.disease = this.generateDisease(index);

        return foundMutation;
    }

    public generateMutationList(): Array<Mutation> {
        const mutationList = new Array<Mutation>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            mutationList.push(this.generateMutation(index));
        }

        return mutationList;
    }

    public generateMutation(index: string): Mutation {
        const mutation: Mutation = new Mutation();

        mutation.accession = 'accession' + index;
        mutation.hgvs = 'hgvs' + index;
        mutation.panelVersion = 1;
        mutation.chromosome = 'chromosome' + index;
        mutation.dbType = 'dbType' + index;
        mutation.dbVersion = 'dbVersion' + index;
        mutation.type = 'type' + index;
        mutation.active = true;
        mutation.startPos = 1;
        mutation.endPos = 66;
        mutation.references = 'references' + index;
        mutation.special = false;
        mutation.show = false;

        return mutation;
    }

    public generateExternalRequestGeneList(): Array<ExternalRequestGene> {
        const externalRequestList = new Array<ExternalRequestGene>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            externalRequestList.push(this.generateExternalRequestGene(index));
        }

        return externalRequestList;
    }

    public generateExternalRequestGene(index: string): ExternalRequestGene {
        const externalRequestGene: ExternalRequestGene = new ExternalRequestGene();

        externalRequestGene.geneName = 'geneName' + index;
        externalRequestGene.finalName = 'finalName' + index;
        externalRequestGene.hgncId = 'hgncId' + index;
        externalRequestGene.aliases = ['alias1' + index, 'alias2' + index, 'alias3' + index];
        // externalRequestGene.request = this.administrativeMock.generateRequest(index);

        return externalRequestGene;
    }

    public generateGeneList(): Array<Gene> {
        const geneList = new Array<Gene>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            geneList.push(this.generateGene(index));
        }

        return geneList;
    }

    public generateGene(index: string): Gene {
        const gene: Gene = new Gene();

        gene.geneName = 'geneName' + index;
        gene.finalName = 'finalName' + index;
        gene.hgncId = 'hgncId' + index;
        gene.panel = true;
        gene.chromosome = 'chromosome' + index;
        gene.aliases = new Array<GeneAlias>();

        gene.aliases.push(this.generateGeneAlias('1'));
        gene.aliases.push(this.generateGeneAlias('2'));
        gene.aliases.push(this.generateGeneAlias('3'));

        return gene;
    }

    public generateGeneAlias(index: string): GeneAlias {
        const alias: GeneAlias = new GeneAlias();

        alias.name = 'geneName' + index;
        alias.ensemblGeneName = 'finalName' + index;

        return alias;
    }

    public generateDiseaseList(): Array<Disease> {
        const diseaseList = new Array<Disease>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            diseaseList.push(this.generateDisease(index));
        }

        return diseaseList;
    }

    public generateDisease(index: string): Disease {
        const disease: Disease = new Disease();
        disease.omim = 'omim' + index;
        disease.heredityPattern = 'hereditartPattern' + index;

        const translation: Translation = new Translation();
        translation.name = 'nombreEnfermedad' + index;
        translation.language = 'es';
        translation.description = 'ES description';
        const translationEn: Translation = new Translation();
        translationEn.name = 'diseaseName' + index;
        translationEn.language = 'en';
        translationEn.description = 'EN description';
        const translations: Translation[] = new Array<Translation>();
        translations.push(translation);
        translations.push(translationEn);

        disease.translations = translations;

        return disease;
    }

    public generateNotMatcheableAction(index: string): Action {
        const action = new Action();
        action.type = action.typeNotMatcheable;
        return action;
    }

    public generateNotSuitableGenesAction(index: string): Action {
        const action = new Action();
        action.type = action.typeNotSuitableGenes;
        action.uncovered = true;
        action.genes = new Array<CommonGene>();

        return action;
    }

    public generateWarningAction(index: string): Action {
        const action = new Action();
        action.type = action.typeWarning;
        action.ruleMatchResultWarning = new Array<Translation>();

        return action;
    }

    public generateXChromoAction(index: string): Action {
        const action = new Action();
        action.type = action.typeXChromo;
        action.hgvs = 'hgvs1';
        action.uncovered = false;
        action.gene = new CommonGene();

        return action;
    }

    public generateXChromoNoNgsAction(index: string): Action {
        const action = new Action();
        action.type = action.typeXChromoNoNgs;
        action.geneRegion = 'geneRegion';
        action.gene = new CommonGene();

        return action;
    }

    public generateActionList(): Array<Action> {
        const actionList = new Array<Action>();

        actionList.push(this.generateNotSuitableGenesAction('1'));
        actionList.push(this.generateWarningAction('2'));
        actionList.push(this.generateXChromoAction('3'));
        actionList.push(this.generateXChromoNoNgsAction('4'));

        return actionList;
    }

    public generateMatchTrack(index: string): MatchTrack {
        const matchTrack = new MatchTrack();

        matchTrack.total = 10;
        matchTrack.completed = 2;
        matchTrack.finished = false;
        matchTrack.customer = 'customerName';
        matchTrack.launched = '2021-02-18 15:25:33';
        matchTrack.error = false;

        return matchTrack;
    }

    public generateCnvRequestList(): Array<CnvRequest> {
        const cnvs = new Array<CnvRequest>();

        const indexArray = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

        for (const index of indexArray) {
            cnvs.push(this.generateCnvRequest(index));
        }

        return cnvs;
    }

    public generateCnvRequest(index: string): CnvRequest {
        const cnv = new CnvRequest();

        cnv.copyNumber = 3;
        cnv.meanCoverage = 78;
        cnv.logRatio = 6;
        cnv.tag = 'tag' + index;
        cnv.comment = 'comment' + index;
        cnv.positive = true;
        cnv.active = true;
        cnv.geneName = 'geneName' + index;
        cnv.panelVersion = 5;
        cnv.location = 'location' + index;
        cnv.transcript = 'transcript' + index;
        cnv.exonNumber = 4;
        cnv.chromosome = 'chromosome' + index;
        cnv.startPos = 1;
        cnv.endPos = 2;
        cnv.show = false;

        return cnv;
    }

    public generateUncoveredMutationList(): Array<UncoveredMutation> {
        const uncoveredMutations = new Array<UncoveredMutation>();

        uncoveredMutations.push(this.generateUncoveredMutation(1));
        uncoveredMutations.push(this.generateUncoveredMutation(2));
        uncoveredMutations.push(this.generateUncoveredMutation(3));

        return uncoveredMutations;
    }

    public generateUncoveredMutation(index: number): UncoveredMutation {
        const uncoveredMutation = new UncoveredMutation();

        uncoveredMutation.disease = this.generateDisease('1');
        uncoveredMutation.chromosome = 'chromosome' + index;
        uncoveredMutation.geneName = 'geneName' + index;
        uncoveredMutation.exonNumber = 'exonNumber' + index;
        uncoveredMutation.intronNumber = 'intronNumber' + index;
        uncoveredMutation.hgvs = 'hgvs' + index;
        uncoveredMutation.mutationType = 'mutationType' + index;
        uncoveredMutation.transcript = 'transcript' + index;
        uncoveredMutation.references = 'references' + index;

        return uncoveredMutation;
    }

    public generateNoNgsMutationList(): Array<NoNgsMutation> {
        const noNgsMutations = new Array<NoNgsMutation>();

        noNgsMutations.push(this.generateNoNgsMutation(1));
        noNgsMutations.push(this.generateNoNgsMutation(2));
        noNgsMutations.push(this.generateNoNgsMutation(3));
        noNgsMutations.push(this.generateNoNgsMutation(4));
        noNgsMutations.push(this.generateNoNgsMutation(5));
        noNgsMutations.push(this.generateNoNgsMutation(6));
        noNgsMutations.push(this.generateNoNgsMutation(7));
        noNgsMutations.push(this.generateNoNgsMutation(8));
        noNgsMutations.push(this.generateNoNgsMutation(9));
        noNgsMutations.push(this.generateNoNgsMutation(10));


        return noNgsMutations;
    }

    public generateNoNgsMutation(index: number): NoNgsMutation {
        const noNgsMutation = new NoNgsMutation();

        // Entity attributes
        noNgsMutation.diseaseName = 'diseaseName' + index;
        noNgsMutation.omim = 'omim' + index;
        noNgsMutation.chromosome = 'chromosome' + index;
        noNgsMutation.geneName = 'geneName' + index;
        noNgsMutation.geneRegion = 'geneRegion' + index;
        noNgsMutation.mutation = 'mutation' + index;
        noNgsMutation.expansion = 'expansion' + index;
        noNgsMutation.mutationType = 'mutationType' + index;
        noNgsMutation.refSequence = 'refSequence' + index;
        noNgsMutation.references = 'references' + index;
        noNgsMutation.agg = 15;
        noNgsMutation.percentage = 44;

        noNgsMutation._links = { self: { href: 'selfUrlNoNgs' + index} ,
            first: { href: 'firstUrlNoNgs' + index },
            last: { href: 'lastUrlNoNgs' + index },
            next: { href: 'nextUrlNoNgs' + index },
            previous: { href: 'previousUrlNoNgs' + index },
            search: { href: 'searchUrlNoNgs' + index }};

        return noNgsMutation;
    }

    public generateStudiedMutationList(): Array<StudiedMutation> {
        const studiedMutations = new Array<StudiedMutation>();

        studiedMutations.push(this.generateStudiedMutation(1));
        studiedMutations.push(this.generateStudiedMutation(2));
        studiedMutations.push(this.generateStudiedMutation(3));

        return studiedMutations;
    }

    public generateStudiedMutation(index: number): StudiedMutation {
        const studiedMutation = new StudiedMutation();

        studiedMutation.geneName = 'geneName' + index;
        studiedMutation.carrierRate = 'carrierRate' + index;
        studiedMutation.carrierRateMax = 'carrierRateMax' + index;
        studiedMutation.carrierRateMin = 'carrierRateMin' + index;
        studiedMutation.residualRisk = 'residualRisk' + index;
        studiedMutation.disease = this.generateDisease('1');
        studiedMutation.ethnicity = this.administrativeMock.generateEthnicity('1');

        return studiedMutation;
    }

    public generateGenotype(index: number): Genotype {
        const genotype = new Genotype();

        genotype.coverage = 98;
        genotype.risks = this.generateStudiedMutationList();
        genotype.foundMutations = this.generateFoundMutationList();
        genotype.uncoveredMutations = this.generateUncoveredMutationList();
        genotype.noNgsMutations = this.generateNoNgsMutationList();
        genotype.risks = this.generateStudiedMutationList();
        genotype.cnvs = this.generateCnvRequestList();
        genotype.uncoveredCnvs = this.generateCnvRequestList();
        genotype.polyTTract = this.generatePolyTTract(index);

        genotype._links =  {
            self: { href: '' },
            'precon:found-mutations': { href: '' },
            'precon:relevant-found-mutations': { href: '' },
            'precon:uncovereds': { href: '' },
            'precon:no-ngs': { href: '' },
            'precon:risks': { href: '' },
            'precon:cnvs': { href: '' },
            'precon:uncovered-cnvs': { href: '' },
            'precon:external-genes': { href: '' }
        };

        return genotype;
    }

    public generatePolyTTract(index: number): PolyTTract {
        const polyTTract = new PolyTTract();

        polyTTract.meanCoverage = 196.41 + index;
        polyTTract.maxDepth = 346 + index;
        polyTTract.tag = 'tag' + index;
        polyTTract.totalReads = 446 + index;
        polyTTract.truncated = 254 + index;
        polyTTract.haplotypes = [ this.generateHaplotype(index), this.generateHaplotype(index + 1)];

        return polyTTract;
    }

    public generateHaplotype(index: number): Haplotype {
        const haplotype = new Haplotype();

        if (index === 1) {
            haplotype.frequency = 0.48;
            haplotype.numReads = 92;
            haplotype.numT = 7;
            haplotype.numTG = 10;
        }

        if (index === 2) {
            haplotype.frequency = 0.43;
            haplotype.numReads = 72;
            haplotype.numT = 7;
            haplotype.numTG = 11;
        }

        return haplotype;
    }

    public generateCnvMetric(index: number): CnvMetrics {
        const cnvMetric = new CnvMetrics();

        cnvMetric.n = 10;
        cnvMetric.ncontrols = 10;
        cnvMetric.minRsquared = 0.958;
        cnvMetric.maxRsquared = 0.97;
        cnvMetric.meanRsquared = 0.963;
        cnvMetric.cnQ1 = 1.927;
        cnvMetric.cnMedian = 2.001;
        cnvMetric.cnQ3 = 2.083;
        cnvMetric.cnIqr = 0.156;
        cnvMetric.cnSnr = 15.307;
        cnvMetric.candidateCnvs = 1;
        cnvMetric.rejected = true;

        return cnvMetric;
    }

    public generateRule(index: string): Rule {
        const rule = new Rule();

        rule.name = 'ruleName' + index;

        rule._links =  {
            self: { href: '' + index },
            'precon:ruleConditionGroupA': { href: '' },
            'precon:ruleConditionGroupB': { href: '' },
            'precon:actions': { href: '' }
        };

        return rule;
    }

    public generateRuleConditionGroup(): RuleConditionGroup {
        const ruleConditionGroup = new RuleConditionGroup();

        ruleConditionGroup.coincidenceType = 'ALL';

        return ruleConditionGroup;
    }

    public generateRuleList(): Array<Rule> {
        const rules = new Array<Rule>();

        const indexArray = [
            '1', '2', '3', '4', '5',
            // '6', '7', '8', '9', '10',
            // '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            // '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            // '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            // '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'
        ];

        for (const index of indexArray) {
            rules.push(this.generateRule(index));
        }

        return rules;
    }

    public generateCondition(): Condition {
        const condition = new Condition();

        condition._links =  {
            self: { href: '' },
            'precon:group': { href: '' },
            'precon:genes': { href: '' },
            'precon:gene': { href: '' }
        };
        condition.type = '';

        return condition;
    }

    public generateConditionList(): Array<Condition> {
        const conditions = new Array<Condition>();

        conditions.push(this.generateCondition());
        conditions.push(this.generateCondition());
        conditions.push(this.generateCondition());
        conditions.push(this.generateCondition());
        conditions.push(this.generateCondition());

        return conditions;
    }

}
