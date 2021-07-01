import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatchScreenComponent } from './match-screen.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';

describe('MatchScreenComponent', () => {
  let component: MatchScreenComponent;
  let fixture: ComponentFixture<MatchScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        TranslateModule,
        MatDialogModule,
        MatSnackBarModule],
      declarations: [ MatchScreenComponent ],
      providers: [ TranslateService, MatDialogModule,
        MatSnackBarModule,
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
