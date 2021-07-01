import { Injectable } from '@angular/core';
import { Request } from '../../models/administrative-model';
import { Genotype, StudiedMutation } from '../../models/genetic-model';
import { Observable, of, Subscription } from 'rxjs';
import { HalObject } from '../../models/common-model';
import { environment } from '../../../environments/environment';
import { Index } from '../../models/authentication-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneticMock } from './genetic.mock';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class StudiedMutationService {

  index: Index;
  indexSubscription: Subscription;

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

  getStudiedMutation(studiedMutationId: number): StudiedMutation {
    return new StudiedMutation();
  }

  getStudiedMutationByRequestId(request: Request): StudiedMutation {
    return new StudiedMutation();
  }

  getStudiedMutationsByGenotype(genotype: Genotype): Observable<HalObject> {
    if (environment.backendConnection) {
      return this.http.get<HalObject>(genotype._links['precon:risks'].href, this.httpOptions).pipe();
    } else {
      return of(this.administrativeMock.generateHalObject('precon:risks', this.geneticMock.generateStudiedMutationList()));
    }
  }

}
