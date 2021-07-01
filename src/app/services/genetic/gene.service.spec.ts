import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GeneService } from './gene.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Gene } from '../../models/genetic-model';
import { environment } from '../../../environments/environment';
import { Pagination } from '../../models/common-model';

describe('GeneServiceTest', () => {
  let service: GeneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(GeneService);
  });

  it('GeneService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getExternalRequest', () => {
    expect(service.getExternalRequest(4).id).toEqual(4);
  });

  it('#ngOnDestroy', () => {
    const spy = spyOn(service.indexSubscription, 'unsubscribe');
    service.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('#listGenes', () => {
    service.listGenes().subscribe(
      response => {
        expect(response.length).toEqual(50);
        expect(response[0]).toBeInstanceOf(Gene);
      });
  });

  it('#listGenesPagination', () => {
      service.listGenesPagination(new Pagination()).subscribe(
        response => {
          expect(response).toBeDefined();
        });
    });

  // createExternalRequestGene

  // deleteExternalRequestGene

  it('#getGeneByRequestAndGene', () => {
    expect(service.getGeneByRequestAndGene(1, 2).id).toEqual(2);
  });

});
