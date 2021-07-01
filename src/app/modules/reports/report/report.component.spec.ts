import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ReportComponent } from './report.component';
import { ReportsService } from '../../../services/report/reports.service';
import { TemplateService } from '../../../services/report/template.service';
declare var require: any;
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
describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let reportsService: ReportsService;
  let templatesService: TemplateService;
  let translateService: TranslateService;
  let matDialog: MatDialog;

  const individual = require('./../../../../assets/individual.json');
  const couple = require('./../../../../assets/couple.json');
  const donor = require('./../../../../assets/oneDonor.json');

  const languages = require('./../../../../assets/languages.json');
  const templates = require('./../../../../assets/templates.json');
  const sampleTypes = require('./../../../../assets/sampleTypes.json');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportComponent ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ReportsService },
        { provide: TranslateService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    reportsService = TestBed.inject(ReportsService) as jasmine.SpyObj<ReportsService>;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    translateService.currentLang = 'en';

    templatesService = TestBed.inject(TemplateService) as jasmine.SpyObj<TemplateService>;
    matDialog = TestBed.inject(MatDialog);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // describe('Individual mode', () => {

    // it('should init vars', () => {
    //
    //   fixture.detectChanges();
    //
    //   console.log('TEST');
    //
    //   component.data = { mode: 'individual', info: individual };
    //   const servgetLangSpy = spyOn(reportsService, 'getLanguages').and.returnValue(of(languages));
    //   const servgetTemplatsSpy = spyOn(templatesService, 'readTemplatesAll').and.returnValue(of(templates));
    //   const servgetSampleTypesSpy = spyOn(reportsService, 'getSampleTypes').and.returnValue(of(sampleTypes));
    //
    //   spyOn(component, 'setMode').and.callThrough();
    //   spyOn(component, 'setIndividual').and.callThrough();
    //   spyOn(component, 'setIndividualValues').and.callThrough();
    //   spyOn(component, 'setTemplates').and.callThrough();
    //   spyOn(component, 'syncData').and.callThrough();
    //
    //   spyOn(component, 'setVariantsData').and.callThrough();
    //   spyOn(component, 'setUncoveredData').and.callThrough();
    //
    //   spyOn(component, 'setLanguages').and.callThrough();
    //   spyOn(component, 'setSampleTypes').and.callThrough();
    //
    //
    //   component.ngOnInit();
    //   fixture.detectChanges();
    //
    //   expect(servgetLangSpy).toHaveBeenCalled();
    //   expect(servgetTemplatsSpy).toHaveBeenCalled();
    //   expect(servgetSampleTypesSpy).toHaveBeenCalled();
    //
    //   expect(component.syncData).toHaveBeenCalled();
    //   expect(component.setTemplates).toHaveBeenCalled();
    //   expect(component.setSampleTypes).toHaveBeenCalled();
    //
    //   expect(component.setMode).toHaveBeenCalled();
    //   expect(component.setLanguages).toHaveBeenCalled();
    //
    //   expect(component.setIndividual).toHaveBeenCalled();
    //   expect(component.title).toEqual('REPORTS.TITLE_INDIVIDUAL');
    //   expect(component.setVariantsData).toHaveBeenCalled();
    //   expect(component.setUncoveredData).toHaveBeenCalled();
    //   expect(component.individual).toBeTruthy();
    //   expect(component.individualMode).toBeTrue();
    //   expect(component.form).toBeDefined();
    //   expect(component.setIndividualValues).toHaveBeenCalled();
    //
    //   expect(component.templates).toBeTruthy();
    //   expect(component.sampleTypes).toBeTruthy();
    //   expect(component.currentLang).toBeTruthy();
    //   expect(component.variantsDataColumns).toBeTruthy();
    //   expect(component.uncoveredDataColumns).toBeTruthy();
    //   expect(component.form.value).toBeTruthy();
    //
    // });

    // it('should generate', () => {
    //   component.data = { mode: 'individual', info: individual };
    //   // Generate
    //   const reportsServiceSpy = spyOn(reportsService, 'generateReport').and.returnValue(of({}));
    //
    //   spyOn(component, 'generateReport').and.callThrough();
    //
    //   fixture.detectChanges();
    //
    //   expect(component.generateReport).toHaveBeenCalled();
    //   expect(reportsServiceSpy).toHaveBeenCalled();
    //
    // });

    // it('should open Variant Data Dialog', () => {
    //
    //   const spy = spyOn(matDialog, 'open').and.callThrough();
    //
    //   component.addVariantData();
    //
    //   expect(spy).toHaveBeenCalled();
    //   fixture.detectChanges();
    //   expect(component.dialogRefData).toBeDefined();
    // });
  //
  // });

  // describe('Couple mode', () => {
  //
  //   it('should init vars', () => {
  //     fixture.detectChanges();
  //
  //     component.data = { mode: 'couple', info: couple };
  //
  //     spyOn(component, 'setMode').and.callThrough();
  //     spyOn(component, 'setCoupleValues').and.callThrough();

      // component.ngOnInit();
      // fixture.detectChanges();
      // expect(component.couple).toBeTruthy();
      // expect(component.coupleMode).toBeTrue();
      // expect(component.title).toEqual('REPORTS.TITLE_COUPLE');
      // expect(component.form).toBeDefined();
      // expect(component.setCoupleValues).toHaveBeenCalled();
  //
  //   });
  // });

  // describe('Donor mode', () => {
  //
  //   it('should init vars', () => {
  //     fixture.detectChanges();
  //
  //     component.data = { mode: 'oneDonor', info: donor };
  //
  //     spyOn(component, 'setMode').and.callThrough();
  //     spyOn(component, 'setDonorValues').and.callThrough();
  //
  //     component.ngOnInit();
  //     fixture.detectChanges();
  //     expect(component.oneDonor).toBeTruthy();
  //     expect(component.oneDonorMode).toBeTrue();
  //     expect(component.title).toEqual('REPORTS.TITLE_ONE_DONOR');
  //     expect(component.form).toBeDefined();
  //     expect(component.setDonorValues).toHaveBeenCalled();
  //   });
  // });

});
