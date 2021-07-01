import { Injectable } from '@angular/core';
import { Genotype, UncoveredMutation } from '../../models/genetic-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Index } from '../../models/authentication-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneticMock } from './genetic.mock';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class UncoveredMutationService {
  index: Index;
  indexSubscription: Subscription;

  uncoveredMutationSubject: BehaviorSubject<UncoveredMutation>;
  uncoveredMutation: Observable<UncoveredMutation>;

  uncoveredMutationListSubject: BehaviorSubject<Array<UncoveredMutation>>;
  uncoveredMutationList: Observable<Array<UncoveredMutation>>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/hal+json'
    })
  };

  constructor(private http: HttpClient,
              public geneticMock: GeneticMock,
              public authenticationService: AuthenticationService) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      console.log('Group service - recovering index from service');
      this.index = indexData as Index;
    });
  }

  getUncoveredMutationsByGenotype(genotype: Genotype): Observable<Array<UncoveredMutation>> {
    if (environment.backendConnection) {
      this.uncoveredMutationList = this.http.get<Array<UncoveredMutation>>(
          genotype._links['precon:uncovereds'].href, this.httpOptions).pipe();
      return this.uncoveredMutationList;
    } else {
      return of(this.geneticMock.generateFoundMutationList());
    }
  }

  getUncoveredMutation(uncoveredMutationId: number): UncoveredMutation {
    return new UncoveredMutation();
  }

  getUncoveredMutationByRequestId(requestId: number): UncoveredMutation {
    return new UncoveredMutation();
  }

  getUncoveredMutationInXByMatchResult(): UncoveredMutation {
    return new UncoveredMutation();
  }

  getUncoveredMutationByRequestIdAndGeneId(): UncoveredMutation {
    return new UncoveredMutation();
  }

}
