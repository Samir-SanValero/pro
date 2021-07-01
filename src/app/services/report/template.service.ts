import { Injectable, OnDestroy } from '@angular/core';
import { Template, TemplateFavourite } from '../../models/report-model';
import { HalObject, Pagination } from '../../models/common-model';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ReportMock } from './report.mock';
import { AdministrativeMock } from '../administrative/administrative.mock';
import { Index } from '../../models/authentication-model';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../authentication/authentication.service';
import * as url from 'url';

@Injectable({ providedIn: 'root' })
export class TemplateService implements OnDestroy {

  index: Index;
  indexSubscription: Subscription;

  templateHalObject: Observable<HalObject>;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    public reportMock: ReportMock,
    public administrativeMock: AdministrativeMock,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
  ) {
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

  ngOnDestroy(): void {
    if (this.indexSubscription !== undefined) {
      this.indexSubscription.unsubscribe();
    }
  }

  listTemplatePagination(pagination: Pagination): Observable<HalObject> {
    console.log('Template service - listing templates');
    if (environment.backendConnection) {
      let params = new HttpParams();
      if (pagination.currentPag !== undefined) {
        params = params.append(environment.setPageNumber, pagination.currentPag.toString());
      }

      if (pagination.currentPagSize !== undefined) {
        params = params.append(environment.setPageSize, pagination.currentPagSize.toString());
      }

      this.templateHalObject = this.http.get<HalObject>(this.index.templatesUrl, { params }).pipe(
        map(data => data as HalObject)
      );
      console.log('Template service - recovered hal object templates');
      return this.templateHalObject;
    } else {
      const halObject = this.administrativeMock.generateHalObject(
        environment.linkTemplateModelList,
        this.reportMock.generateTemplateList());
      return of(halObject);
    }
  }

  deleteTemplate(template: Template): Observable<any> {
    if (environment.backendConnection) {
      return this.http.delete<any>(template._links.self.href, this.httpOptions).pipe(
        map(data => data as Template)
      );
    } else {
      return of('');
    }
  }

  uploadTemplate(template: Template): Observable<Template> {
    if (environment.backendConnection) {
      return this.http.post<Template>(template._links.self.href, JSON.stringify(template), this.httpOptions).pipe(
        map(data => data as Template)
      );
    } else {
      return of(this.reportMock.generateTemplate('1'));
    }
  }

  getTemplateFavourites(): Array<TemplateFavourite> {
    return new Array<TemplateFavourite>();
  }

  addTemplateFavourites(templateId: number, templateFavourite: TemplateFavourite): void {

  }

  readTemplateFavourites(templateUrl): Observable<any> {
    return this.http.get('assets/templateFavourites.json');
  }

  readTemplateFavouritesAll(paginator: any): Observable<any> {
    return this.http.get('assets/templateFavouritesAll.json');
  }

  readTemplatesAll(paginator: any): Observable<any> {
    return this.http.get('assets/templates.json');
  }

  delete(deletingUrl: string): Observable<any> {
    return of();
  }

  createTemplate(template: any): Observable<any> {
    if (environment.backendConnection) {
      return this.http.post<any>(this.index.templatesUrl, JSON.stringify(template), this.httpOptions).pipe(
        map(data => data as Template)
      );
    } else {
      return of(this.reportMock.generateTemplate('1'));
    }
  }

  updateTemplate(updatingUrl: string, template: any): Observable<any> {
    if (environment.backendConnection) {
      return this.http.post<Template>(template._links.self.href, JSON.stringify(template), this.httpOptions).pipe(
        map(data => data as Template)
      );
    } else {
      return of(this.reportMock.generateTemplate('1'));
    }
  }

  updateImage(position: string, image: any): Observable<any> {
    console.log('UPLOAD IMAGE POSITION: ' + position);
    console.log('UPLOAD IMAGE: ' + image);

    if (environment.backendConnection) {
      return this.http.post<string>('' + position, image, this.httpOptions).pipe(
        map(data => data as string)
      );
    } else {
      return of(this.reportMock.generateTemplate('1'));
    }
  }

  uploadTemplateImage(uploadUrl, position: string, image: any): Observable<any> {
    // this.httpClient.put(url + '/images/' + position, image)
    return of(true);
  }

  deleteTemplateImage(templateUrl: string, position: string): Observable<any> {
    return of(true);
  }

  saveTemplateFavourites(templateUrl: any, templateFavourite: any): any {
    return of({});
  }

  setFavourite(template: Template, reportName: string, language: string): Observable<TemplateFavourite> {
    let favourite = new TemplateFavourite();
    favourite.reportName = reportName;
    favourite.language = language;

    if (environment.backendConnection) {
      return this.http.post<TemplateFavourite>(environment.apiUrl + '/templateFavourites', favourite, this.httpOptions).pipe(
        map(data => data)
      );
    } else {
      return of(new TemplateFavourite());
    }
  }

}
