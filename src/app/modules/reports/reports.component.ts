import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ReportComponent } from './report/report.component';
import { ReportsService } from '../../services/report/reports.service';
import { Requestor } from '../../models/requestor.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {

  dialogRef: MatDialogRef<ReportComponent>;
  individual: any = {};
  couple: any = {};
  oneDonor: any = {};

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private reportsService: ReportsService
  ) { }

  ngOnInit(): void {
    this.getIndividual();
    this.getCouple();
    this.getOneDonor();
  }

  getIndividual(): void {
    this.reportsService.getIndividual().subscribe(
      data => {
        this.individual = data;
      }
    );
  }

  getCouple(): void {
    this.reportsService.getCouple().subscribe(
      data => {
        this.couple = data;
      }
    );
  }

  getOneDonor(): void {
    this.reportsService.getOneDonor().subscribe(
      data => {
        this.oneDonor = data;
      }
    );
  }

  openIndividualReport(data: Requestor): void {
    this.dialogRef = this.dialog.open(ReportComponent, {
      width: '1600px',
      data: { mode: 'individual', info: data }
    });
  }

  openCoupleReport(data: Requestor): void {
    this.dialogRef = this.dialog.open(ReportComponent, {
      width: '1600px',
      data: { mode: 'couple', info: data }
    });
  }

  openOneDonorReport(data: Requestor): void {
    this.dialogRef = this.dialog.open(ReportComponent, {
      width: '1600px',
      data: { mode: 'oneDonor', info: data }
    });
  }

}
