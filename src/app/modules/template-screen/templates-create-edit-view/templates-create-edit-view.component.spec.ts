import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TemplatesCreateEditViewComponent } from './templates-create-edit-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageSelectorComponent } from '../image-selector/image-selector.component';
import { SignaturesComponent } from '../signatures/signatures.component';
import {SignatureService} from '../../../services/report/signature.service';
import {TemplateService} from '../../../services/report/template.service';
import {RouterTestingModule} from '@angular/router/testing';

declare var require: any;

describe('TemplatesCreateEditViewComponent', () => {
  let component: TemplatesCreateEditViewComponent;
  let fixture: ComponentFixture<TemplatesCreateEditViewComponent>;

  let templatesServices: TemplateService;
  let signatureServices: SignatureService;
  let loader: HarnessLoader;
  let dialogRef;
  const templates = require('./../../../../assets/templates.json');
  const signatures = require('./../../../../assets/signatures.json');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplatesCreateEditViewComponent, ImageSelectorComponent, SignaturesComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        RouterTestingModule
      ],
      providers: [
        { provide: SignatureService },
        { provide: TemplateService },
        { provide: TranslateService },
        MatDialogModule,
        TranslateService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesCreateEditViewComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    dialogRef = TestBed.inject(MatDialogRef);

    templatesServices = TestBed.inject(TemplateService) as jasmine.SpyObj<TemplateService>;
    signatureServices = TestBed.inject(SignatureService) as jasmine.SpyObj<SignatureService>;
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // describe('create mode', () => {
  //   // it('should init vars', () => {
  //   //   expect(component.createMode).toBeTrue();
  //   //   expect(component.template).toBeTruthy();
  //   // });
  //
  //   // it('should create template', () => {
  //   //   const template = {
  //   //     name: 'new template',
  //   //     version: 1,
  //   //     companyName: 'test',
  //   //     companyAddress: 'test',
  //   //     companyPhones: 'test',
  //   //     companyElectronicAddress: 'test'
  //   //   };
  //   //
  //   //   // Set template images
  //   //   const templateImages = {
  //   //     left_image: {
  //   //       position: 'left_image',
  //   //       image: new File([''],
  //   //         'filename',
  //   //         {
  //   //           type: 'image/png'
  //   //         })
  //   //     },
  //   //     right_image: '',
  //   //     lateral_image: {
  //   //       position: 'lateral_image',
  //   //       image: new File([''],
  //   //         'filename',
  //   //         {
  //   //           type: 'image/png'
  //   //         })
  //   //     },
  //   //     background_image: {
  //   //       position: 'background_image',
  //   //       image: new File([''],
  //   //         'filename',
  //   //         {
  //   //           type: 'image/png'
  //   //         })
  //   //     }
  //   //   };
  //   //
  //   //   const signaturesToUpload = [
  //   //     {
  //   //       image: new File([''],
  //   //         'filename',
  //   //         { type: 'image/png' }),
  //   //       signature: { name: '', rol: '', position: 0 }
  //   //     }];
  //   //   component.templateImages = templateImages;
  //   //   component.setSignaturesToUpload(signaturesToUpload);
  //   //
  //   //   const serviceCreateSpy = templatesServices.createTemplate =
  //   //     jasmine.createSpy().and.returnValue(of(templates._embedded['precon:templateModelList'][0]));
  //   //   const newSignature = {
  //   //     name: 'signature.name',
  //   //     rol: 'signature.rol',
  //   //     position: 'signature.position',
  //   //     additionalInfo: 'signature.additionalInfo',
  //   //     _links: {
  //   //       self: {
  //   //         href: 'http://localhost:8080/api/signatures/500'
  //   //       }
  //   //     }
  //   //   };
  //   //
  //   //   const serviceSignatureCreateSpy = signatureServices.createSignature =
  //   //     jasmine.createSpy('serviceSignatureCreateSpy').and.returnValue(of(newSignature));
  //   //   const imageSignatureSpy = signatureServices.uploadSignatureImage =
  //   //     jasmine.createSpy('serviceSignatureCreateSpy').and.returnValue(of(''));
  //   //   const imageTemplateSpy = templatesServices.uploadTemplateImage =
  //   //     jasmine.createSpy('serviceSignatureCreateSpy').and.returnValue(of(''));
  //   //
  //   //   spyOn(component, 'createLinks').and.callThrough();
  //   //
  //   //   component.createTemplate(template);
  //   //   component.setImage(templateImages.right_image);
  //   //
  //   //   fixture.detectChanges();
  //   //   expect(component.dialogRef).toBeDefined();
  //   //   expect(component.templateImages).toBeTruthy();
  //   //   expect(component.signaturesToUpload).toBeTruthy();
  //   //   expect(serviceCreateSpy).toHaveBeenCalled();
  //   //   expect(component.createLinks).toHaveBeenCalled();
  //   //   expect(serviceSignatureCreateSpy).toHaveBeenCalled();
  //   //   expect(imageSignatureSpy).toHaveBeenCalled();
  //   //   expect(imageTemplateSpy).toHaveBeenCalled();
  //   //   expect(component.templateImages.right_image).toEqual(templateImages.right_image);
  //   //   expect(component.signaturesToUpload).toEqual(signaturesToUpload);
  //   // });
  // });
  //
  // describe('view mode', () => {
  //   // it('should init vars', () => {
  //   //   const template = templates._embedded['precon:templateModelList'][0];
  //   //   component.data = {
  //   //     viewMode: true,
  //   //     template: { template }
  //   //   };
  //   //   const signatureGetSpy = signatureServices.getTemplateSignatures =
  //   //     jasmine.createSpy().and.returnValue(of(signatures));
  //   //   spyOn(component, 'setTitle').and.callThrough();
  //   //
  //   //   component.ngOnInit();
  //   //   expect(component.viewMode).toBeTrue();
  //   //   expect(component.template).toBeTruthy();
  //   //   expect(component.title).toBeTruthy();
  //   //   expect(signatureGetSpy).toHaveBeenCalled();
  //   //   expect(component.setTitle).toHaveBeenCalled();
  //   // });
  // });
  //
  // describe('edit mode', () => {
  //   // it('should init vars', () => {
  //   //   const template = templates._embedded['precon:templateModelList'][0];
  //   //   component.data = {
  //   //     editMode: true,
  //   //     template: { template }
  //   //   };
  //   //   // const signatureGetSpy = signatureServices.getTemplateSignatures =
  //   //   //   jasmine.createSpy().and.returnValue(of(signatures));
  //   //
  //   //   component.ngOnInit();
  //   //   expect(component.editMode).toBeTrue();
  //   //   expect(component.template).toBeTruthy();
  //   //   expect(component.title).toBeTruthy();
  //   //   expect(component.templateUrl).toBeTruthy();
  //   //   // expect(signatureGetSpy).toHaveBeenCalled();
  //   // });
  //
  //   // it('should update template', () => {
  //   //   const template = templates._embedded['precon:templateModelList'][0];
  //   //   component.data = {
  //   //     editMode: true,
  //   //     template: { template }
  //   //   };
  //   //
  //   //   const templateForm = {
  //   //     name: 'template updated',
  //   //     version: 2,
  //   //     companyName: 'test',
  //   //     companyAddress: 'test',
  //   //     companyPhones: 'test',
  //   //     companyElectronicAddress: 'test'
  //   //   };
  //   //
  //   //   const serviceUpdateSpy = templatesServices.updateTemplate = jasmine.createSpy().and.returnValue(of(templates._embedded['precon:templateModelList'][0]));
  //   //   fixture.detectChanges();
  //   //   component.updateTemplate(templateForm);
  //   //   expect(serviceUpdateSpy).toHaveBeenCalled();
  //   //
  //   // });
  // });
});
