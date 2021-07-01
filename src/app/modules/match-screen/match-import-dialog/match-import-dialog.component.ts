import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HalObject, ImportMatchDialogData, Pagination } from '../../../models/common-model';
import { RequestService } from '../../../services/administrative/request.service';
import { Request } from '../../../models/administrative-model';
import { environment } from '../../../../environments/environment';
import { forkJoin, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-match-import-dialog',
  templateUrl: './match-import-dialog.component.html',
  styleUrls: ['./match-import-dialog.component.scss']
})
export class MatchImportDialogComponent implements OnInit, OnDestroy {

  loading: boolean;
  subscription: Subscription;
  inputText: string;

  constructor(
    public dialogRef: MatDialogRef<MatchImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImportMatchDialogData,
    public requestService: RequestService,
  ) {}

  ngOnInit(): void {
    this.loading = false;
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  acceptButton(): void {
    this.loading = true;

    const codesString = this.inputText.split(/[ ,]+/);

    const observables: Observable<HalObject>[] = [];

    for (const code of codesString) {
      console.log('Searching code: ' + code);
      observables.push(this.searchRequest(code));
    }

    this.subscription = forkJoin(observables)
      .subscribe(dataArray => {
        const observableList = dataArray as HalObject[];

        for (const hal of observableList) {
          const requestAux: Array<Request> = new Array<Request>();
          if (hal._embedded !== null
            && hal._embedded !== undefined
            && hal._embedded[environment.linksRequests] !== null
            && hal._embedded[environment.linksRequests] !== undefined) {
            hal._embedded[environment.linksRequests].forEach(element => {
              requestAux.push(Request.fromObject(element));
            });
          }
          if (requestAux.length > 0) {
            this.data.requests.push(requestAux[0]);
          }
        }

        this.loading = false;
        this.dialogRef.close(this.data);
      });

  }

  cancelButton(): void {
    this.dialogRef.close();
  }

  searchRequest(code: string): Observable<HalObject> {
    const pagination = new Pagination();
    pagination.textFilter = code;
    pagination.currentPagSize = 1;
    let parameter: string;
    parameter = 'urCode';

    return this.requestService.getRequestByParameter(pagination, parameter);
  }

}
