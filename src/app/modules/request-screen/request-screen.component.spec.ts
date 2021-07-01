import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RequestScreenComponent } from './request-screen.component';
import { RequestService } from '../../services/administrative/request.service';
import { of } from 'rxjs';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('RequestScreenComponent', () => {
  let mock: AdministrativeMock;
  let component: RequestScreenComponent;
  let fixture: ComponentFixture<RequestScreenComponent>;
  let service: RequestService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [ RequestScreenComponent ],
      providers: [
        TranslateService,
        MatDialogModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // We inject the service
    service = TestBed.inject(RequestService);
    mock = TestBed.inject(AdministrativeMock);
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject service', () => {
    expect(service).toBeTruthy();
  });

  it('should call listRequestsPagination', () => {
    const halObject = mock.generateHalObject(environment.linksRequests, mock.generateRequestList());

    // We test mock list of objects
    spyOn(service, 'listRequestsPagination').and.callThrough().and.returnValue(of(halObject));

    component.ngOnInit();
    expect(service.listRequestsPagination).toHaveBeenCalled();
  });

  it('should call loadMainData', () => {
    // We test mock list of objects
    spyOn(component, 'processListRequests');

    component.ngOnInit();
    expect(component.processListRequests).toHaveBeenCalled();
  });

  it('should call loadGeneticData', () => {
    // We test mock list of objects
    spyOn(component, 'loadGeneticData');

    component.ngOnInit();
    expect(component.loadGeneticData).toHaveBeenCalled();
  });

  it('addRequest should open existing request', () => {
    component.editRequest(mock.generateRequest('1'));
    expect(component.editingRequest).toBeDefined();
  });
  //
  // it('save request should call service', () => {
  //   spyOn(service, 'updateRequest').and.returnValue(of(mock.generateRequest('1')));
  //
  //   component.saveRequest(mock.generateRequest('1'));
  //   expect(service.updateRequest).toHaveBeenCalled();
  //
  //   component.adding = true;
  //   component.saveRequest(mock.generateRequest('1'));
  //   expect(service.updateRequest).toHaveBeenCalled();
  //
  //   component.showRecord = true;
  //   component.saveRequest(mock.generateRequest('1'));
  //   expect(service.updateRequest).toHaveBeenCalled();
  // });

});
