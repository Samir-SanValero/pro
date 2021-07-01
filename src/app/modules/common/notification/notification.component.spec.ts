import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
          MatSnackBarModule,
          TranslateModule.forRoot()
      ],
      declarations: [ NotificationComponent ],
      providers: [
        MatSnackBarModule,
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        TranslateService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
