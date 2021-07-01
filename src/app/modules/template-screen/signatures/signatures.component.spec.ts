import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { EditCreateSignaturesFieldsComponent } from './edit-create-signatures-fields/edit-create-signatures-fields.component';

import { SignaturesComponent } from './signatures.component';
import {SignatureService} from '../../../services/report/signature.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

export class MatDialogMock {
  data: any;
  open(): any {
    return {
      afterClosed: () => of()
    };
  }
}

describe('SignaturesComponent', () => {
  let matDialog: MatDialog;
  let component: SignaturesComponent;
  let fixture: ComponentFixture<SignaturesComponent>;
  let signatureService: SignatureService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [SignaturesComponent, EditCreateSignaturesFieldsComponent],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: FormBuilder, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();
  });



  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturesComponent);
    component = fixture.componentInstance;
    matDialog = TestBed.inject(MatDialog);
    signatureService = TestBed.inject(SignatureService) as jasmine.SpyObj<SignatureService>;

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('create dialog', () => {

    // it('should open the create dialog', async(() => {
    //   fixture.detectChanges();
    //
    //   const spy = spyOn(matDialog, 'open').and.callThrough();
    //   component.create();
    //
    //   expect(spy).toHaveBeenCalledOnceWith(EditCreateSignaturesFieldsComponent,
    //     {
    //       width: '500px',
    //       data: {
    //         fieldLabel: 'Add signature',
    //         createMode: true,
    //         templateUrl: null
    //       }
    //     }
    //   );
    //
    // }));

    it('should close a dialog and get back a result', waitForAsync(() => {

      // TODO
      fixture.detectChanges();

      component.create();

      spyOn(component.dialogRef, 'afterClosed').and.returnValue(
        of({ name: 'test' })
      );
      expect(component.dialogRef).toBeDefined();
    }));
  });
});
