import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationMockService } from '../authentication/authentication.mock.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { DiseaseService } from '../genetic/disease.service';
import { RequestService } from '../administrative/request.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GeneticMock } from '../../services/genetic/genetic.mock';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';
import { Genotype } from '../../models/genetic-model';
import { Observable } from 'rxjs';
import { ExportExcelService } from './export-excel.service';

describe('ExportExcelService', () => {
  let service: ExportExcelService;
  const ad: AdministrativeMock = new AdministrativeMock();
  const geneticMock: GeneticMock = new GeneticMock(ad);

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({})],
        providers: [HttpClient, DiseaseService, RequestService, TranslateService,
        {
            provide: AuthenticationService,
            useClass: AuthenticationMockService,
        }]
    });
    service = TestBed.inject(ExportExcelService);
  });

  it('should be created', (done: DoneFn) => {
    expect(service).toBeTruthy();
    done();
  });

  // it('#infoFromRequest should return value', (done: DoneFn) => {
  //   const result = service.infoFromRequest('test');
  //   result.then(data => {
  //       expect(data).toEqual('test');
  //       done();
  //   });
  // });

  it('#infoFromGenotype should return value', (done: DoneFn) => {
    const genotype: Genotype = geneticMock.generateGenotype(3);
    const observables: Observable<any> = service.infoFromGenotype(genotype);
    observables.subscribe(
            ({cnvs,
            foundMutation,
            noNgs,
            risks,
            uncovered,
            polyT}) => {
                expect(cnvs.tag).toEqual('tag1');
                expect(foundMutation.hgvs).toEqual('hgvs1');
                expect(noNgs.geneName).toEqual('geneName1');
                expect(risks.geneName).toEqual('geneName1');
                expect(uncovered.hgvs).toEqual('hgvs1');
                expect(polyT.tag).toEqual('tag1');
                done();
            });
  });

  it('#processFoundMutation should return value', (done: DoneFn) => {
    const result: Array<Array<string>> = service.processFoundMutation(geneticMock.generateFoundMutationList());
    expect(result.length).toEqual(50);
    expect(result[0][1]).toEqual('chromosome1');
    done();
  });

  it('#processCnvs should return value', (done: DoneFn) => {
    const result: Array<Array<string>> = service.processCnvs(geneticMock.generateCnvRequestList());
    expect(result.length).toEqual(50);
    expect(result[0][5]).toEqual('geneName1');
    done();
  });

  it('#processNoNgsMutation should return value', (done: DoneFn) => {
    const result: Array<Array<string>> = service.processNoNgsMutation(geneticMock.generateNoNgsMutationList());
    expect(result.length).toEqual(10);
    expect(result[0][1]).toEqual('omim1');
    done();
  });

  it('#processRisks should return value', (done: DoneFn) => {
    const result: Array<Array<string>> = service.processRisks(geneticMock.generateStudiedMutationList());
    expect(result.length).toEqual(3);
    expect(result[1][0]).toEqual('geneName2');
    done();
  });

  it('#processUncovered should return value', (done: DoneFn) => {
    const result: Array<Array<string>> = service.processUncovered(geneticMock.generateUncoveredMutationList());
    expect(result.length).toEqual(3);
    expect(result[0][1]).toEqual('chromosome1');
    done();
  });

  // it('#processPolyT should return value', (done: DoneFn) => {
  //   const result: Array<Array<string>> = service.processPolyT(geneticMock.generatePolyTTract(1).haplotypes);
  //   console.log(result);
  //   expect(result.length).toEqual(2);
  //   expect(result[0][0]).toEqual('0.48');
  //   done();
  // });
});
