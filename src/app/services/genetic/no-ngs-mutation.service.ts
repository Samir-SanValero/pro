import { Injectable } from '@angular/core';
import {Genotype, MatchResult, NoNgsAcceptedValues, NoNgsMutation} from '../../models/genetic-model';
import { Request } from '../../models/administrative-model';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { Index } from '../../models/authentication-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneticMock } from './genetic.mock';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { HalObject } from '../../models/common-model';

@Injectable({ providedIn: 'root' })
export class NoNgsMutationService {

  index: Index;
  indexSubscription: Subscription;

  noNgsMutationSubject: BehaviorSubject<NoNgsMutation>;
  noNgsMutation: Observable<NoNgsMutation>;

  noNgsMutationListSubject: BehaviorSubject<Array<NoNgsMutation>>;
  noNgsMutationList: Observable<Array<NoNgsMutation>>;

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

  getNoNgsMutation(mutationId: number): NoNgsMutation {
    return new NoNgsMutation();
  }

  getNoNgsMutationByGenotype(genotype: Genotype): Observable<HalObject> {
    if (environment.backendConnection) {
      return this.http.get<HalObject>(genotype._links['precon:no-ngs'].href, this.httpOptions).pipe();

    } else {
      console.log('Returning no ngs list mock');
      return of(this.administrativeMock.generateHalObject('precon:mutation_no_ngs', this.geneticMock.generateNoNgsMutationList()));
    }
  }

  listNoNgsMutations(): Array<NoNgsMutation> {
    return new Array<NoNgsMutation>();
  }

  listNoNgsMutationsByRequest(request: Request): Observable<Array<NoNgsMutation>> {
    const mutationList = this.administrativeMock.generateNoNgsMutationList();
    return of(mutationList);
  }

  listNoNgsMutationByRequestAndGene(request: Request, geneId: number): Array<NoNgsMutation> {
    return new Array<NoNgsMutation>();
  }

  listNoNgsMutationByMatchResult(matchResult: MatchResult): Array<NoNgsMutation> {
    return new Array<NoNgsMutation>();
  }

  listNoNgsAcceptedValues(): Observable<Array<NoNgsAcceptedValues>> {
    if (environment.backendConnection) {
      return this.http.get<Array<NoNgsAcceptedValues>>(this.index.noNgsMutationsUrl + '/possible_values', this.httpOptions).pipe();
    } else {
      console.log('Returning no ngs list mock');
      return of();
    }
  }

  createNoNgsMutationInRequest(noNgsMutation: NoNgsMutation, request: Request): void {

  }

  editNoNgsMutationInRequest(noNgsMutation: NoNgsMutation, request: Request): void {

  }

  deleteNoNgsMutationInRequest(noNgsMutation: NoNgsMutation): Observable<any> {
    console.log('No NGS mutation service - deleting no ngs mutation');
    console.log('Calling: ' + noNgsMutation._links.self.href);

    if (environment.backendConnection) {
      // return of('');
      return this.http.delete<any>(noNgsMutation._links.self.href, this.httpOptions);
    } else {
      return of('');
    }
  }

}
