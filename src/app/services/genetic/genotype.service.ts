import { Injectable } from '@angular/core';
import { Genotype } from '../../models/genetic-model';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { GeneticMock } from './genetic.mock';
import { Index } from '../../models/authentication-model';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GenotypeService {

  index: Index;
  indexSubscription: Subscription;

  genotypeSubject: BehaviorSubject<Genotype>;
  genotype: Observable<Genotype>;

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
      console.log('Genotype service - recovering index from service');
      this.index = indexData as Index;
    });
  }

  getGenotypeByRequest(genotypeUrl: string): Observable<Genotype> {
    if (environment.backendConnection) {
      this.genotype = this.http.get<Genotype>(genotypeUrl, this.httpOptions).pipe();
      return this.genotype;
    } else {
      return of(this.geneticMock.generateGenotype(1));
    }
  }

  getExternalGenotype(genotypeId: number): Observable<Genotype> {
    if (environment.backendConnection) {

    } else {
      return of(this.geneticMock.generateGenotype(1));
    }
  }

  selectGenotype(genotype: Genotype): Observable<Genotype> {
    this.genotypeSubject.next(genotype);
    return this.genotypeSubject.asObservable();
  }

  getSelectedGenotype(): Observable<Genotype> {
    return this.genotypeSubject.asObservable().pipe();
  }

}
