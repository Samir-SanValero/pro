import { Injectable } from '@angular/core';
import { FoundMutation, Genotype, MatchResult } from '../../models/genetic-model';
import { GeneticMock } from './genetic.mock';
import { BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import { environment } from '../../../environments/environment';
import { Index } from '../../models/authentication-model';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HalObject } from '../../models/common-model';
import { AdministrativeMock } from '../administrative/administrative.mock';

@Injectable({ providedIn: 'root' })
export class FoundMutationService {

  index: Index;
  indexSubscription: Subscription;

  foundMutationSubject: BehaviorSubject<FoundMutation>;
  foundMutation: Observable<FoundMutation>;

  foundMutationListSubject: BehaviorSubject<Array<FoundMutation>>;
  foundMutationList: Observable<Array<FoundMutation>>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/hal+json'
    })
  };

  constructor(private http: HttpClient,
              public geneticMock: GeneticMock,
              public administrativeMock: AdministrativeMock,
              public authenticationService: AuthenticationService) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      console.log('Group service - recovering index from service');
      this.index = indexData as Index;
    });
  }

  getFoundMutationsByGenotype(genotype: Genotype): Observable<HalObject> {
    if (environment.backendConnection) {
      return this.http.get<HalObject>(genotype._links['precon:found-mutations'].href, this.httpOptions).pipe();
    } else {
      return of(this.administrativeMock.generateHalObject('precon:found_mutations', this.geneticMock.generateFoundMutationList()));
    }
  }

  getRisksByGenotype(genotype: Genotype): Observable<HalObject> {
    if (environment.backendConnection) {
      return this.http.get<HalObject>(genotype._links['precon:risks'].href, this.httpOptions).pipe();
    } else {
      return of(this.administrativeMock.generateHalObject('precon:risks', this.geneticMock.generateStudiedMutationList()));
    }
  }

  getFoundMutationList(): Observable<HalObject> {
    if (environment.backendConnection) {

    } else {
      return of(this.administrativeMock.generateHalObject('precon:found_mutations', this.geneticMock.generateFoundMutationList()));
    }
  }

  getFoundMutation(fountMutationId: number): Observable<FoundMutation> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateFoundMutation('1'));
    }
  }

  getFoundMutationByRequestId(requestId: number): Observable<FoundMutation> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateFoundMutation('1'));
    }
  }

  getFoundMutationByRequestIdAndGeneId(requestId: number, geneId: number): Observable<FoundMutation> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateFoundMutation('1'));
    }
  }

  getFoundMutationInXByMatchResult(matchResult: MatchResult): Observable<FoundMutation> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateFoundMutation('1'));
    }
  }

}
