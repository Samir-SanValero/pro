import { Injectable } from '@angular/core';
import { Signature } from '../../models/report-model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SignatureService {

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(public httpClient: HttpClient) {

  }

  listSignatures(): Array<Signature> {
    return new Array<Signature>();
  }

  uploadImage(signatureId: number, image: string): void {

  }

  updateSignature(url: string, signature: any): Observable<any> {
    return of('');
  }

  getSignatures(): Observable<any> {
    if (environment.backendConnection) {

    } else {

    }

    return this.httpClient.get('assets/signatures.json');
  }

  getTemplateSignatures(templateId: string): Observable<any> {
    return this.httpClient.get('assets/templateSignatures.json');
  }

  createSignature(templateUrl: string, signature: any): Observable<any> {
    const newSignature = {
      name: signature.name,
      rol: signature.rol,
      position: signature.position,
      additionalInfo: signature.additionalInfo,
      _links: {
        self: {
          href: 'http://localhost:8080/api/signatures/500'
        }
      }
    };
    return of(newSignature);
  }

  uploadSignatureImage(signature: Signature, file: File): Observable<any> {
    console.log('Signature service - uploadSignatureImage');
    const httpFormOptions = {
      headers: new HttpHeaders({
        'Content-Disposition': 'form-data; name=file; filename=image.png',
        'Content-Type': 'image/png',
      })
    };

    if (environment.backendConnection) {
      return this.httpClient.put<any>(signature._links['precon:image'].href, httpFormOptions).pipe(
        map(data => data as Signature)
      );
    } else {
      return of('');
    }
  }

  deleteSignature(signature: Signature): Observable<any> {
    console.log('Signature service - deleting signature');
    if (environment.backendConnection) {
      return this.httpClient.delete<any>(signature._links.self.href, this.httpOptions).pipe(
        map(data => data as Signature)
      );
    } else {
      return of('');
    }
  }
}
