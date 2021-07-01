import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DiseaseService } from './disease.service';
import { AuthenticationMockService } from '../authentication/authentication.mock.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Disease, Gene } from '../../models/genetic-model';
import { Pagination } from '../../models/common-model';

describe('DiseaseServiceTest', () => {
  let service: DiseaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [HttpClient,
      {
          provide: AuthenticationService,
          useClass: AuthenticationMockService,
      }]
    });
    service = TestBed.inject(DiseaseService);
  });

  it('DiseaseServiceTest should be created', () => {
     expect(service).toBeTruthy();
  });

  it('#getDisease', () => {
    const diseaseId = 2;
    service.getDisease(diseaseId).subscribe(
        response => {
            expect(response).toBeTruthy();
            expect(response.id).toEqual(diseaseId);
        });
  });

  // it('#getDiseaseByOmim', () => {
  //   const omim = 'AL';
  //   service.getDiseaseByOmim(new Pagination()).subscribe(
  //     response => {
  //       expect(response[0].omim).toEqual(omim);
  //       expect(response[1].omim).toEqual(omim);
  //     });
  // });
  //
  // it('#getDiseaseByName', () => {
  //   const name = 'James';
  //   service.getDiseaseByName(new Pagination()).subscribe(
  //     (response: Array<Disease>) => {
  //       expect(response.length).toEqual(2);
  //       expect(response[0].translations[0].name).toEqual(name);
  //       expect(response[1].translations[0].name).toEqual(name);
  //     });
  // });

  it('#listDiseases', () => {
    service.listDiseases().subscribe(
      response => {
        expect(response.length).toEqual(50);
      });
  });

  it('#listDiseasePagination', () => {
      const result = service.listDiseasePagination(new Pagination());
      expect(result).toBeDefined();
  });

  it('#updateDisease', () => {
      const result = service.updateDisease(new Disease());
      expect(result).toBeDefined();
  });

  it('#getDiseaseGenes', () => {
    service.getDiseaseGenes(1).subscribe(
      response => {
        expect(response.length).toEqual(1);
        expect(response[0]).toBeInstanceOf(Gene);
      });
  });

  it('#getUrlApiRestV3', () => {
    service.getUrlApiRestV3('http://10.0.1.64:8091/precon/api/diseases/2', Disease).subscribe(
      response => {
          expect(response._embedded).not.toBeNull();
          expect(response._embedded.href).toBeTruthy();
          expect(response._embedded.href.length).toEqual(1);
          expect(response._embedded.href[0]).toBeInstanceOf(Disease);
      });
  });

});
