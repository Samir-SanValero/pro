import { Injectable } from '@angular/core';
import { CommonGene, ExternalRequestGene } from '../../models/genetic-model';
import { Observable, of } from 'rxjs';
import { GeneticMock } from './genetic.mock';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExternalRequestGeneService {

  constructor(public geneticMock: GeneticMock) { }

  getExternalRequest(externalRequestId: number): ExternalRequestGene {
    if (environment.backendConnection) {

    } else {
      return new ExternalRequestGene();
    }
  }

  listExternalRequestGene(): Observable<ExternalRequestGene[]>{
    if (environment.backendConnection) {

    } else {
      const externalRequestList = this.geneticMock.generateExternalRequestGeneList();
      return of(externalRequestList);
    }
  }

  createExternalRequestGene(commonGene: CommonGene, externalRequestId: number): void {
    if (environment.backendConnection) {

    } else {

    }
  }

  deleteExternalRequestGene(commonGene: CommonGene, externalRequestId: number): void {
    if (environment.backendConnection) {

    } else {

    }
  }

  getGeneByRequestAndGene(requestId: number, geneId: number): CommonGene {
    if (environment.backendConnection) {

    } else {
      return new CommonGene();
    }
  }
}
