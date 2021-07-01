import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ReportComponent } from './report/report.component';
import { ReportsComponent } from './reports.component';
import { ReportsService } from '../../services/report/reports.service';
import { Requestor } from '../../models/requestor.model';
import { RouterTestingModule } from '@angular/router/testing';

export class MatDialogMock {
  open(): any {
    return {
      afterClosed: () => of({ name: '' })
    };
  }
}

const mockDialogRef = {
  close: jasmine.createSpy('close')
};
describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let matDialog: MatDialog;
  let translateService: TranslateService;
  let reportsService: ReportsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsComponent, ReportComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), BrowserAnimationsModule, RouterTestingModule],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: TranslateService },
        { provide: ReportsService },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    translateService.currentLang = 'en';
    matDialog = TestBed.inject(MatDialog);
    reportsService = TestBed.inject(ReportsService) as jasmine.SpyObj<ReportsService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Individual report dialog', () => {

    it('should open Individual Report dialog', () => {
      fixture.detectChanges();

      const data: Requestor = {
        name: 'Pedro Garcia',
        urCode: 'UR0054255'
      };

      const spy = spyOn(matDialog, 'open').and.callThrough();
      const serv = reportsService.getIndividual =
        jasmine.createSpy().and.returnValue(of({}));

      component.openIndividualReport(data);
      // expect(serv).toHaveBeenCalled();

      expect(spy).toHaveBeenCalled();

      expect(component.dialogRef).toBeDefined();
    });
  });
});
