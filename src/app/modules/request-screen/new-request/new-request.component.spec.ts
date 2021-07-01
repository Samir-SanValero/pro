import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewRequestComponent } from './new-request.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('NewRequestComponent', () => {
  let component: NewRequestComponent;
  let fixture: ComponentFixture<NewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDatepickerModule,
        MatCardModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        MatRadioModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ NewRequestComponent ],
      providers: [
        MatDatepicker,
        DateAdapter,
        MatDialogModule,
        TranslateService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ethnicities', () => {
    component.loadEthnicities();
    expect(component.ethnicities).toBeDefined();
  });

  it('should load countries', () => {
    component.loadCountries();
    expect(component.countries).toBeDefined();
  });

  it('should load groups', () => {
    component.loadGroups();
    expect(component.groups).toBeDefined();
  });

  it('should load types', () => {
    component.loadRequestTypes();
    expect(component.requestTypes).toBeDefined();
  });

  // it('processListGenes should load genes ', () => {
  //   component.processListGenes();
  //   expect(component.genes).toBeDefined();
  // });

  it('translateCountry should translate countries', () => {
    component.translateCountries();

    for (const country of component.countries) {
      expect(country.viewTranslation).toBeDefined();
    }
  });

  it('translateEthnicity should translate ethnicities', () => {
    component.translateEthnicity();

    for (const ethnicity of component.ethnicities) {
      expect(ethnicity.viewTranslation).toBeDefined();
    }
  });



});
