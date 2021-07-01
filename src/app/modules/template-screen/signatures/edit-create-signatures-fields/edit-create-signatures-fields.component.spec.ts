import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditCreateSignaturesFieldsComponent } from './edit-create-signatures-fields.component';
import {SignatureService} from '../../../../services/report/signature.service';
import {MatDialogMock} from '../../../reports/reports.component.spec';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('EditCreateSignaturesFieldsComponent', () => {
  let component: EditCreateSignaturesFieldsComponent;
  let fixture: ComponentFixture<EditCreateSignaturesFieldsComponent>;
  let dialogData;
  let dialogService;
  let signatureService: SignatureService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, MatDialogModule, BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [EditCreateSignaturesFieldsComponent],
      providers: [
        { provide: FormBuilder, useValue: {} },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateSignaturesFieldsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    dialogService = TestBed.inject(MatDialogRef);
    signatureService = TestBed.inject(SignatureService) as jasmine.SpyObj<SignatureService>;
    fixture.detectChanges();
  });

  // it('should init vars', async () => {
  //   expect(component.createMode).toBeTruthy();
  //   // expect(component.fieldLabel).toEqual('Add signature');
  //   // expect(component.signature).toEqual({
  //   //   name: '',
  //   //   rol: '',
  //   //   position: 0,
  //   //   additionalInfo: ''
  //   // });
  //
  // });
  //
  // it('should createMode false', async () => {
  //
  //   dialogData.signature = { name: 'My signature' };
  //   dialogData.createMode = false;
  //   dialogData.isEditMode = true;
  //   component.ngOnInit();
  //   expect(component.data.signature).toEqual({
  //     name: 'My signature'
  //   });
  //
  // });
  //
  // it('should set image', () => {
  //   component.setImage({
  //     srcElement: {
  //       files: [new File([''], 'filename', { type: 'image/png' })]
  //     }
  //   });
  //   expect(component.image).toEqual(new File([''], 'filename', { type: 'image/png' }));
  // });
  //
  // it('should create and save signature', () => {
  //   component.createMode = true;
  //   component.save({});
  //   expect(component.dialogRef.close).toHaveBeenCalled();
  // });

});
