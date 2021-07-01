import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HalObject } from '../../models/common-model';
import { map } from 'rxjs/operators';
import { Index } from '../../models/authentication-model';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { ReportMock } from './report.mock';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  index: Index;
  indexSubscription: Subscription;

  constructor(private httpClient: HttpClient,
              private translateService: TranslateService,
              private authenticationService: AuthenticationService,
              private administrativeMock: AdministrativeMock,
              private reportMock: ReportMock) {
    this.indexSubscription = this.authenticationService.getIndexObservable().subscribe((indexData) => {
      this.index = indexData as Index;

      if (translateService.currentLang === undefined || translateService.currentLang === null) {
        translateService.currentLang = 'ES';
      }

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept-Language': translateService.currentLang
        })
      };
    });
  }

  getIndividual(): Observable<any> {
    return this.httpClient.get('assets/individual.json');
  }

  getCouple(): any {
    return this.httpClient.get('assets/couple.json');
  }

  getOneDonor(): any {
    return this.httpClient.get('assets/oneDonor.json');
  }

  getGeneticRisks(): any {
    return this.httpClient.get('assets/risks.json');
  }

  getLanguages(): Observable<any> {
    console.log('Template service - listing templates');
    if (environment.backendConnection) {
      return this.httpClient.get<HalObject>(this.index.templatesAcceptedUrl, this.httpOptions).pipe(
        map(data => data as HalObject)
      );
    } else {
      const halObject = this.administrativeMock.generateHalObject(
        environment.linkAcceptedLanguages,
        this.reportMock.generateAcceptedLanguages());
      return of(halObject);
    }
  }

  getLanguage(languageRelationUrl: any): Observable<any> {
    return this.httpClient.get('assets/language.json');
  }

  getSampleTypes(currentLang: any): Observable<any> {
    console.log('Template service - listing templates');
    if (environment.backendConnection) {
      return this.httpClient.get<HalObject>(this.index.templatesSampleTypesUrl + '?language=' + currentLang, this.httpOptions).pipe(
        map(data => data as HalObject)
      );
    } else {
      const halObject = this.administrativeMock.generateHalObject(
        environment.linkSampleTypes,
        this.reportMock.generateSampleTypes());
      return of(halObject);
    }
  }

  getTemplate(templateRelationUrl: any): Observable<any> {
    return this.httpClient.get('assets/template.json');
  }

  updateTemplateReport(templateUrl: any): Observable<any> {
    return of('');
  }

  updateLanguageReport(languageUrl: any): Observable<any> {
    return of('');
  }

  generateReport(report): Observable<any> {
    console.log('Report service - generating reports');
    if (environment.backendConnection) {
      return this.httpClient.put<HalObject>(environment.apiUrl + '/individual_report_statuses/', report, this.httpOptions).pipe(
        map(data => data as HalObject)
      );
    } else {
      return of('');
    }
  }

}
