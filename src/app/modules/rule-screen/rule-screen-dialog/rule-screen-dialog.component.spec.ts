import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RuleScreenDialogComponent } from './rule-screen-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';

describe('RuleScreenDialogComponent', () => {
  let component: RuleScreenDialogComponent;
  let fixture: ComponentFixture<RuleScreenDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule, TranslateModule.forRoot() ],
      declarations: [RuleScreenDialogComponent ],
      providers: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateService,
        MatSnackBarModule,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleScreenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
