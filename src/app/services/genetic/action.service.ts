import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GeneticMock } from './genetic.mock';
import { Action, CommonGene, Rule } from '../../models/genetic-model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActionService {

  constructor(public geneticMock: GeneticMock) { }

  getActionById(id: string): Observable<Action> {
    if (environment.backendConnection) {

    } else {
      const action = this.geneticMock.generateNotMatcheableAction(id);
      return of(action);
    }
  }

  listActionsByRule(rule: Rule): Observable<Array<Action>> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateActionList());
    }
  }

  createAction(action: Action): Observable<Action> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateNotSuitableGenesAction('1'));
    }
  }

  updateAction(action: Action): Observable<Action> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateNotSuitableGenesAction('1'));
    }
  }

  deleteAction(action: Action): void {
    if (environment.backendConnection) {

    } else {

    }
  }

  getGeneOfAction(): Observable<CommonGene> {
    if (environment.backendConnection) {

    } else {
      const gene = new CommonGene();
      return of(gene);
    }
  }

  setGeneOfAction(): void {
    if (environment.backendConnection) {

    } else {

    }
  }

}
