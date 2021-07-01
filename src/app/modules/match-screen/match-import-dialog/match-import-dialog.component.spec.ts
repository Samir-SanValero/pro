import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {RuleScreenDialogComponent} from '../../rule-screen/rule-screen-dialog/rule-screen-dialog.component';

describe('RuleScreenDialogComponent', () => {
  let component: RuleScreenDialogComponent;
  let fixture: ComponentFixture<RuleScreenDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule, TranslateModule.forRoot() ],
      declarations: [ RuleScreenDialogComponent ],
      providers: [
        MatDialogModule,
        TranslateService,
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
