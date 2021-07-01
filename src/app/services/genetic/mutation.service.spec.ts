import { TestBed } from '@angular/core/testing';
import { MutationService } from './mutation.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationMockService } from '../authentication/authentication.mock.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pagination } from '../../models/common-model';
import { GeneticMock } from './genetic.mock';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { Mutation } from '../../models/genetic-model';

describe('MutationServiceTest', () => {
  let service: MutationService;
  const ad: AdministrativeMock = new AdministrativeMock();
  const geneticMock: GeneticMock = new GeneticMock(ad);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [HttpClient, MutationService,
                 {
                      provide: AuthenticationService,
                      useClass: AuthenticationMockService,
                 }]
    });
    service = TestBed.inject(MutationService);
  });

  it('MutationService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#ngOnDestroy', () => {
    const spy = spyOn(service.indexSubscription, 'unsubscribe');
    service.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('#listMutations', () => {
     const result = service.listMutations();
     expect(result).toBeDefined();
    });

  it('#patchMutation', () => {
      const result = service.patchMutation(geneticMock.generateMutation('5'));
      expect(result).toBeDefined();
  });

  it('#listMutationPagination', () => {
      const result = service.listMutationPagination(new Pagination());
      expect(result).toBeDefined();
  });

  it('#changeStatus', () => {
      let mut: Mutation = geneticMock.generateMutation('5');
      mut.active = false;
      mut = service.changeStatus(mut);
      expect(mut.active).toEqual(true);
  });

});
