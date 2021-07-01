import { Injectable } from '@angular/core';
import { BackendError } from '../../models/error-model';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  readError(backendError: BackendError): string {
    let errorResult = '';

    if (backendError.errors !== undefined) {
      for (const error of backendError.errors) {
        if (error.field !== undefined && error.message !== undefined) {
          errorResult = errorResult + error.field + ' ' + error.message + '. ';
        }
      }
    } else {
      errorResult = backendError.message;
    }

    return errorResult;
  }
}
