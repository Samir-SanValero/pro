import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RuleScreenComponent } from './rule-screen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';
import { RuleService } from '../../services/genetic/rule.service';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { GeneticMock } from '../../services/genetic/genetic.mock';

describe('RuleScreenComponent', () => {
  let administrativeMock: AdministrativeMock;
  let geneticMock: GeneticMock;
  let component: RuleScreenComponent;
  let fixture: ComponentFixture<RuleScreenComponent>;
  let service: RuleService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule.forRoot()],
      declarations: [ RuleScreenComponent ],
      providers: [
        TranslateService,
        MatDialogModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // We inject the service
    service = TestBed.inject(RuleService);
    administrativeMock = TestBed.inject(AdministrativeMock);
    geneticMock = TestBed.inject(GeneticMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject service', () => {
    expect(service).toBeTruthy();
  });

  it('should call listBanksPagination', () => {
    const halObject = administrativeMock.generateHalObject(environment.linksRules, geneticMock.generateRuleList());

    // We test mock list of objects
    spyOn(service, 'listRulesPagination').and.callThrough().and.returnValue(of(halObject));

    component.ngOnInit();
    expect(service.listRulesPagination).toHaveBeenCalled();
  });

});
