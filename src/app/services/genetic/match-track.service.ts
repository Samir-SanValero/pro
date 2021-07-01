import { Injectable } from '@angular/core';
import { MatchTrack } from '../../models/genetic-model';
import { Observable, of } from 'rxjs';
import { GeneticMock } from './genetic.mock';

@Injectable({ providedIn: 'root' })
export class MatchTrackService {

  constructor(public geneticMock: GeneticMock) { }

  getMatchTrack(matchTrackId: string): Observable<MatchTrack> {
    const matchTrack = this.geneticMock.generateMatchTrack(matchTrackId);

    return of(matchTrack);
  }

  listMatchTracksByRequestId(requestId: number): Observable<Array<MatchTrack>> {
    const matchTracks = new Array<MatchTrack>();

    matchTracks.push(this.geneticMock.generateMatchTrack('1'));
    matchTracks.push(this.geneticMock.generateMatchTrack('2'));
    matchTracks.push(this.geneticMock.generateMatchTrack('3'));

    return of(matchTracks);
  }

}
