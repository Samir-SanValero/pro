import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EditCreateFieldsComponent } from './edit-create-fields.component';
import {TemplateService} from '../../../services/report/template.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('EditCreateFieldsComponent', () => {
  let component: EditCreateFieldsComponent;
  let fixture: ComponentFixture<EditCreateFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCreateFieldsComponent],
      imports: [BrowserAnimationsModule, TranslateModule.forRoot()],
      providers: [{
        provide: MatDialogRef, useValue: {},
      },
      {
        provide: TemplateService, useValue: {},
      }, TranslateService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
