import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  imageToBase64(file: File): Observable<any> {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    return fromEvent(reader, 'load').pipe(pluck('currentTarget', 'result'));
  }
}