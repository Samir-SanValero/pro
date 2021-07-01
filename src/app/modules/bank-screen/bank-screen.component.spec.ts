import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BankScreenComponent } from './bank-screen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';
import { BankService } from '../../services/administrative/bank.service';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';

describe('BankScreenComponent', () => {
  let mock: AdministrativeMock;
  let component: BankScreenComponent;
  let fixture: ComponentFixture<BankScreenComponent>;
  let service: BankService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule.forRoot()],
      declarations: [ BankScreenComponent ],
      providers: [
        TranslateService,
        MatDialogModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // We inject the service
    service = TestBed.inject(BankService);
    mock = TestBed.inject(AdministrativeMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject service', () => {
    expect(service).toBeTruthy();
  });

  it('should call listBanksPagination', () => {
    const halObject = mock.generateHalObject(environment.linksBanks, mock.generateBankList());

    // We test mock list of objects
    spyOn(service, 'listBanksPagination').and.callThrough().and.returnValue(of(halObject));

    component.ngOnInit();
    expect(service.listBanksPagination).toHaveBeenCalled();
  });

});
