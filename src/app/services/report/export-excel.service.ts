import { Injectable } from '@angular/core';
import { MatchResultService } from '../genetic/match-result.service';
import { MatchRequestService } from '../administrative/match-request.service';
import { DiseaseService } from '../genetic/disease.service';
import { RequestService } from '../administrative/request.service';
import { Request } from '../../models/administrative-model';
import { ApiRequest, FoundMutation,
         CnvRequest, NoNgsMutation,
         Disease, Genotype,
         StudiedMutation, UncoveredMutation,
         PolyTTract, Haplotype } from '../../models/genetic-model';
import { environment } from '../../../environments/environment';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { GeneticMock } from '../genetic/genetic.mock';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  infoSubscription: Subscription;

  constructor(public matchResultService: MatchResultService,
              public matchRequestService: MatchRequestService,
              public translateService: TranslateService,
              public requestService: RequestService,
              public diseaseService: DiseaseService,
              public geneticMock: GeneticMock) // To use apiV3 method
  { }

  generateExcel(requestId: string): void {
    const t0 = performance.now();
    const info = this.infoFromRequest(requestId);
    const t1 = performance.now();
    console.log('Time getting data' + (t1 - t0));
    info.then(data => {
      console.log('data: ' + data);
      data.subscribe(
        ({
          cnvs, foundMutation,
          noNgs, risks,
          uncovered, polyT, relevantMutation
        }) => {
          const resultRisks = this.processRisks(risks._embedded[environment.linksStudiedMutation]);
          const resultFoundMutation = this.processFoundMutation(foundMutation._embedded[environment.linksFound_Mutations]);
          const resultCnvs = this.processCnvs(cnvs._embedded[environment.linksCnvs]);
          const resultNoNgs = this.processNoNgsMutation(noNgs._embedded[environment.linksMutationNoNgs]);
          const resultUncovered = this.processUncovered(uncovered._embedded[environment.linksUncoveredMutations]);
          const resultPolyT = this.processPolyT(polyT.haplotypes);


          const workbook = new Excel.Workbook();

          // FoundMutations
          const foundMutationsSheet = workbook.addWorksheet(this.translateService.instant('export-file.titles.found-mutation'));
          foundMutationsSheet.columns = [
            { header: this.translateService.instant('export-file.disease-name'),  width: 30 },
            { header: this.translateService.instant('export-file.chromosome'),  width: 20 },
            { header: this.translateService.instant('export-file.gene'),  width: 10 },
            { header: this.translateService.instant('export-file.exon'),  width: 10 },
            { header: this.translateService.instant('export-file.intron'),  width: 10 },
            { header: this.translateService.instant('export-file.category'),  width: 15 },
            { header: this.translateService.instant('export-file.hgvs'),  width: 15 },
            { header: this.translateService.instant('export-file.tag'),  width: 15 },
            { header: this.translateService.instant('export-file.mutation-type'),  width: 20 },
            { header: this.translateService.instant('export-file.transcript'),  width: 20 },
            { header: this.translateService.instant('export-file.references'),  width: 25 }
          ];

          resultFoundMutation.forEach (element => {
              foundMutationsSheet.addRow(element);
          });

          // CNVs
          const cnvsSheet = workbook.addWorksheet(this.translateService.instant('export-file.titles.cnv'));
          cnvsSheet.columns = [
            { header: this.translateService.instant('export-file.copy-number'), width: 20 },
            { header: this.translateService.instant('export-file.min-coverage'), width: 20 },
            { header: this.translateService.instant('export-file.log-ratio'), width: 20 },
            { header: this.translateService.instant('export-file.tag'), width: 20 },
            { header: this.translateService.instant('export-file.observations'), width: 20 },
            { header: this.translateService.instant('export-file.gene'), width: 20 },
            { header: this.translateService.instant('export-file.transcript'), width: 20 },
            { header: this.translateService.instant('export-file.exon'), width: 20 },
            { header: this.translateService.instant('export-file.start-position'), width: 20 },
            { header: this.translateService.instant('export-file.end-position'), width: 20 },
            { header: this.translateService.instant('export-file.chromosome'), width: 20 },
            { header: this.translateService.instant('export-file.positive'), width: 20 },
            { header: this.translateService.instant('export-file.active'), width: 20 }
          ];

          resultCnvs.forEach (element => {
              cnvsSheet.addRow(element);
          });

          // Risks
          const studiedMutationsSheet = workbook.addWorksheet(this.translateService.instant('export-file.titles.residual-risk'));
          studiedMutationsSheet.columns = [
            { header: this.translateService.instant('export-file.gene'), width: 20 },
            { header: this.translateService.instant('export-file.disease-name'), width: 20 },
            { header: this.translateService.instant('export-file.omim'), width: 20 },
            { header: this.translateService.instant('export-file.ethnicity'), width: 20 },
            { header: this.translateService.instant('export-file.carrier-rate'), width: 20 },
            { header: this.translateService.instant('export-file.residual-risk'), width: 20 }
          ];

          resultRisks.forEach (element => {
              studiedMutationsSheet.addRow(element);
          });

          // Uncovered Mutations
          const uncoveredSheet = workbook.addWorksheet(this.translateService.instant('export-file.titles.uncovered'));
          uncoveredSheet.columns = [
            { header: this.translateService.instant('export-file.disease-name'), width: 40 },
            { header: this.translateService.instant('export-file.chromosome'), width: 15 },
            { header: this.translateService.instant('export-file.gene'), width: 15 },
            { header: this.translateService.instant('export-file.exon'), width: 15 },
            { header: this.translateService.instant('export-file.intron'), width: 15 },
            { header: this.translateService.instant('export-file.hgvs'), width: 15 },
            { header: this.translateService.instant('export-file.mutation-type'), width: 20 },
            { header: this.translateService.instant('export-file.transcript'), width: 20 },
            { header: this.translateService.instant('export-file.references'), width: 30 }
          ];

          resultUncovered.forEach (element => {
              uncoveredSheet.addRow(element);
          });

          // No Ngs Mutations
          const noNgsSheet = workbook.addWorksheet(this.translateService.instant('export-file.titles.no-ngs'));
          noNgsSheet.columns = [
            { header: this.translateService.instant('export-file.disease-name'), width: 40 },
            { header: this.translateService.instant('export-file.omim'), width: 15 },
            { header: this.translateService.instant('export-file.chromosome'), width: 15 },
            { header: this.translateService.instant('export-file.gene'), width: 15 },
            { header: this.translateService.instant('export-file.gene-region'), width: 15 },
            { header: this.translateService.instant('export-file.mutation'), width: 15 },
            { header: this.translateService.instant('export-file.mutation-type'), width: 15 },
            { header: this.translateService.instant('export-file.references'), width: 15 }
          ];

          resultNoNgs.forEach (element => {
              noNgsSheet.addRow(element);
          });

          const polyTSheet = workbook.addWorksheet(this.translateService.instant('export-file.titles.poly-t'));
          polyTSheet.columns = [
            { header: this.translateService.instant('export-file.frequency'), width: 20 },
            { header: this.translateService.instant('export-file.read-number'), width: 20 },
            { header: this.translateService.instant('export-file.t-number'), width: 20 },
            { header: this.translateService.instant('export-file.tg-number'), width: 20 }
          ];

          resultPolyT.forEach (element => {
              polyTSheet.addRow(element);
          });

          if (relevantMutation !== undefined) {
            if (relevantMutation._embedded[environment.linksFound_Mutations] !== undefined) {
              const resultRelevantMutations = this.processRelevantMutation(relevantMutation._embedded[environment.linksFound_Mutations]);

              // RelevantMutations
              const relevantMutationSheet = workbook.addWorksheet(this.translateService.instant('export-file.titles.relevant-mutation'));
              relevantMutationSheet.columns = [
                { header: this.translateService.instant('export-file.disease-name'),  width: 30 },
                { header: this.translateService.instant('export-file.chromosome'),  width: 20 },
                { header: this.translateService.instant('export-file.gene'),  width: 10 },
                { header: this.translateService.instant('export-file.exon'),  width: 10 },
                { header: this.translateService.instant('export-file.intron'),  width: 10 },
                { header: this.translateService.instant('export-file.category'),  width: 15 },
                { header: this.translateService.instant('export-file.hgvs'),  width: 15 },
                { header: this.translateService.instant('export-file.tag'),  width: 15 },
                { header: this.translateService.instant('export-file.mutation-type'),  width: 20 },
                { header: this.translateService.instant('export-file.transcript'),  width: 20 },
                { header: this.translateService.instant('export-file.references'),  width: 25 }
              ];

              resultRelevantMutations.forEach (element => {
                relevantMutationSheet.addRow(element);
              });
            }
          }

          // Save excel
          workbook.xlsx.writeBuffer().then((fileData) => {
              const blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              fs.saveAs(blob, 'export-request-' + requestId + '.xlsx');
          });
          const t2 = performance.now();
          console.log('Time processing data' + (t2 - t1));
          console.log('Total time:' + (t2 - t0));
        });
    });
  }

  public infoFromRequest(requestId: string): Promise<any> {
      return new Promise ((resolve, reject) => {
          let result: Request = null;
          this.requestService.getRequestByUrCode(requestId).subscribe(
          (response: ApiRequest<Request>) => {
              if (response._embedded !== null && response._embedded !== undefined
                  && response._embedded[environment.linksRequests] !== null
                  && response._embedded[environment.linksRequests] !== undefined) {
                  response._embedded[environment.linksRequests].forEach (element => {
                      if (element.urCode.toLowerCase() === requestId.toLowerCase()) {
                          result = Request.fromObject(element);
                      }
                  });
              }

              if (result !== null) {
                  if (result._links !== null
                      && result._links !== undefined
                      && result._links[environment.linksGenotype] !== null
                      && result._links[environment.linksGenotype] !== undefined) {
                      this.diseaseService.getUrlApiRestV3(result._links[environment.linksGenotype][environment.href], Genotype)
                          .subscribe(
                              responseGenotype => {
                                  if (responseGenotype._links !== null
                                          && responseGenotype._links !== undefined) {
                                  }
                                  resolve(this.infoFromGenotype(Genotype.fromObject(responseGenotype)));
                              });
                  }
              } else {
                  reject();
              }
          });
      });
  }

  public infoFromGenotype(genotype: Genotype): Observable<any> {
      if (environment.backendConnection) {
          let obsFoundMutation: Observable<ApiRequest<FoundMutation>> = of(null);
          if (genotype._links[environment.linksFoundMutations] !== null && genotype._links[environment.linksFoundMutations] !== undefined) {
              obsFoundMutation =
                this.diseaseService.getUrlApiRestV3(genotype._links[environment.linksFoundMutations][environment.href], FoundMutation);
          }

          let obsCnv: Observable<ApiRequest<CnvRequest>> = of(null);
          if (genotype._links[environment.linksCnvs] !== null && genotype._links[environment.linksCnvs] !== undefined) {
              obsCnv = this.diseaseService.getUrlApiRestV3(genotype._links[environment.linksCnvs][environment.href], CnvRequest);
          }

          let obsNoNgs: Observable<ApiRequest<NoNgsMutation>> = of(null);
          if (genotype._links[environment.linksNoNgs] !== null && genotype._links[environment.linksNoNgs] !== undefined) {
              obsNoNgs = this.diseaseService.getUrlApiRestV3(genotype._links[environment.linksNoNgs][environment.href], NoNgsMutation);
          }

          let obsRisk: Observable<ApiRequest<StudiedMutation>> = of(null);
          if (genotype._links[environment.linksRisks] !== null && genotype._links[environment.linksRisks] !== undefined) {
              obsRisk = this.diseaseService.getUrlApiRestV3(genotype._links[environment.linksRisks][environment.href], StudiedMutation);
          }

          let obsUncovered: Observable<ApiRequest<UncoveredMutation>> = of(null);
          if (genotype._links[environment.linksRisks] !== null && genotype._links[environment.linksRisks] !== undefined) {
              obsUncovered =
                this.diseaseService.getUrlApiRestV3(genotype._links[environment.linksUncovered][environment.href],
                UncoveredMutation);
          }

          let polyT = new PolyTTract();
          if (genotype.polyTTract !== null && genotype.polyTTract !== undefined) {
              polyT = PolyTTract.fromObject(genotype.polyTTract);
          }

          let obsRelevantMutation: Observable<ApiRequest<FoundMutation>> = of(null);
          if (genotype._links[environment.linksRelevantMutation] !== null && genotype._links[environment.linksRelevantMutation] !== undefined) {
            obsRelevantMutation =
              this.diseaseService.getUrlApiRestV3(genotype._links[environment.linksRelevantMutation][environment.href], FoundMutation);
          }

          return forkJoin({
              foundMutation: obsFoundMutation,
              cnvs: obsCnv,
              noNgs: obsNoNgs,
              risks: obsRisk,
              uncovered: obsUncovered,
              polyT: of(polyT),
              relevantMutation: obsRelevantMutation,
            });
      } else {
          return forkJoin({
              foundMutation: of (this.geneticMock.generateFoundMutation('1')),
              cnvs: of (this.geneticMock.generateCnvRequest('1')),
              noNgs: of (this.geneticMock.generateNoNgsMutation(1)),
              risks: of (this.geneticMock.generateStudiedMutation(1)),
              uncovered: of (this.geneticMock.generateUncoveredMutation(1)),
              polyT: of (this.geneticMock.generatePolyTTract(1)),
              relevantMutation: of (this.geneticMock.generateFoundMutation('1'))
            });
      }
  }

  public processFoundMutation(array: Array<FoundMutation>): Array<Array<string>> {
      const result: Array<Array<string>> = new Array<Array<string>>();
      if (array !== undefined && array !== null) {
          array.forEach (element => {
              const foundMutation: FoundMutation = FoundMutation.fromObject(element);
              console.log('RELEVANT: ' + foundMutation.mutationType);
              const line: Array<string> = [Disease.fromObject(foundMutation.disease).getName(this.translateService.currentLang),
                                           foundMutation.chromosome, foundMutation.geneName, foundMutation.exonNumber,
                                           foundMutation.intronNumber, foundMutation.category, foundMutation.hgvs,
                                           foundMutation.tag, foundMutation.mutationType,
                                           foundMutation.transcript, foundMutation.references];
              result.push(line);
          });
      } else {
          console.log('ExportExcelService::processFoundMutation - Array doesn\'t exists');
      }

      return result;
  }

  public processRelevantMutation(array: Array<FoundMutation>): Array<Array<string>> {
    const result: Array<Array<string>> = new Array<Array<string>>();
    if (array !== undefined && array !== null) {
      array.forEach (element => {
        const foundMutation: FoundMutation = FoundMutation.fromObject(element);
        console.log('RELEVANT: ' + foundMutation.mutationType);
        const line: Array<string> = [Disease.fromObject(foundMutation.disease).getName(this.translateService.currentLang),
          foundMutation.chromosome, foundMutation.geneName, foundMutation.exonNumber,
          foundMutation.intronNumber, foundMutation.category, foundMutation.hgvs,
          foundMutation.tag, foundMutation.mutationType,
          foundMutation.transcript, foundMutation.references];
        result.push(line);
      });
    } else {
      console.log('ExportExcelService::processRelevantMutation - Array doesn\'t exists');
    }

    return result;
  }

  public processCnvs(array: Array<CnvRequest>): Array<Array<string>> {
      const result: Array<Array<string>> = new Array<Array<string>>();
      if (array !== undefined && array !== null) {
          array.forEach (element => {
              const cnvRequest: CnvRequest = CnvRequest.fromObject(element);
              const line: Array<string> = [String(cnvRequest.copyNumber), String(cnvRequest.meanCoverage), String(cnvRequest.logRatio),
                                           cnvRequest.tag, cnvRequest.comment, cnvRequest.geneName,
                                           cnvRequest.transcript, String(cnvRequest.exonNumber), String(cnvRequest.startPos),
                                           String(cnvRequest.endPos), cnvRequest.chromosome,
                                           String(cnvRequest.positive), String(cnvRequest.active)];
              result.push(line);
          });
      } else {
          console.log('ExportExcelService::processCnvs - Array doesn\'t exists');
      }
      return result;
  }

  public processNoNgsMutation(array: Array<NoNgsMutation>): Array<Array<string>> {
      const result: Array<Array<string>> = new Array<Array<string>>();
      if (array !== undefined && array !== null) {
          array.forEach (element => {
              const noNgsMutation: NoNgsMutation = NoNgsMutation.fromObject(element);
              const line: Array<string> = [noNgsMutation.diseaseName, noNgsMutation.omim, noNgsMutation.chromosome,
                                           noNgsMutation.geneName, noNgsMutation.geneRegion, noNgsMutation.mutation,
                                           noNgsMutation.mutationType, noNgsMutation.references];
              result.push(line);
          });
      } else {
          console.log('ExportExcelService::processNoNgsMutation - Array doesn\'t exists');
      }
      return result;
  }

  public processRisks(array: Array<StudiedMutation>): Array<Array<string>> {
          const result: Array<Array<string>> = new Array<Array<string>>();
          if (array !== undefined && array !== null) {
              array.forEach (async element => {
                  const studiedMutation: StudiedMutation = StudiedMutation.fromObject(element);
                  const line: Array<string> = [studiedMutation.geneName, '', '', '',
                                               studiedMutation.carrierRate, studiedMutation.residualRisk];
                  result.push(line);
              });
          } else {
              console.log('ExportExcelService::processRisks - Array doesn\'t exists');
          }
          return result;
  }

  public processUncovered(array: Array<UncoveredMutation>): Array<Array<string>> {
      const result: Array<Array<string>> = new Array<Array<string>>();
      if (array !== undefined && array !== null) {
          array.forEach (element => {
              const uncovered: UncoveredMutation = UncoveredMutation.fromObject(element);
              const disease: Disease = Disease.fromObject(uncovered.disease);
              const line: Array<string> = [disease.getName(this.translateService.currentLang), uncovered.chromosome, uncovered.geneName,
                                           uncovered.exonNumber, uncovered.intronNumber, uncovered.hgvs,
                                           uncovered.mutationType, uncovered.transcript, uncovered.references];
              result.push(line);
          });
      } else {
          console.log('ExportExcelService::processUncovered - Array doesn\'t exists');
      }
      return result;
  }

  public processPolyT(array: Array<Haplotype>): Array<Array<string>> {
      const result: Array<Array<string>> = new Array<Array<string>>();
      if (array !== undefined && array !== null) {
          array.forEach (element => {
              const haplo: Haplotype = Haplotype.fromObject(element);
              const line: Array<string> = [String(haplo.frequency), String(haplo.numReads), String(haplo.numT), String(haplo.numTG)];
              result.push(line);
          });
      } else {
          console.log('ExportExcelService::processFoundMutation - Array doesn\'t exists');
      }
      return result;
  }

}
