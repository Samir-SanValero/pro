import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CnvRequestService } from '../../services/genetic/cnv-request.service';
import { DiseaseService } from '../../services/genetic/disease.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, } from '@angular/material/dialog';
import { HttpClient, HttpHandler} from '@angular/common/http';
import { AuthenticationMockService } from '../../services/authentication/authentication.mock.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { CnvScreenComponent } from './cnv-screen.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { GeneticMock } from '../../services/genetic/genetic.mock';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';
import { MatSpinner } from '@angular/material/progress-spinner';

describe('CnvScreenComponent', () => {
  let geneticMock: GeneticMock;
  let administrativeMock: AdministrativeMock;
  let component: CnvScreenComponent;
  let fixture: ComponentFixture<CnvScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        OverlayModule,
        MatDialogModule,
        TranslateModule.forRoot()],
      declarations: [ CnvScreenComponent ],
      providers: [HttpClient, HttpHandler, MatDialog, CnvRequestService, DiseaseService, MatSnackBar, MatSpinner,
      {
        provide: AuthenticationService,
        useClass: AuthenticationMockService,
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnvScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    administrativeMock = TestBed.inject(AdministrativeMock);
    geneticMock = TestBed.inject(GeneticMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit', () => {
    const spy = spyOn(component, 'processListCnvs');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('#processListCnvs', () => {
    component.processListCnvs();
    expect(component.cnvs).not.toBeNull();
  });

  it('#editCnv', () => {
    component.editCnv(null);
    expect(component.editing).toEqual(true);
  });

  it('#toggleCnv', () => {
    const spy = spyOn(component.cnvRequestService, 'patchCnv');
    component.toggleCnv(geneticMock.generateCnvRequest('1'));
    expect(spy).toHaveBeenCalled();
  });

  it('#sortCnvs', () => {
    const spy = spyOn(component, 'processListCnvs');
    component.sortCnvs(null);
    expect(spy).toHaveBeenCalled();
  });

  it('#showNotification', () => {
    const spy = spyOn(component.notificationMessage, 'openFromComponent');
    component.showNotification('TEST', 'test_class');
    expect(spy).toHaveBeenCalled();
  });

  it('#pageChanged', () => {
    const spy = spyOn(component, 'processListCnvs');
    component.pageChanged(null);
    expect(spy).toHaveBeenCalled();
  });
});
