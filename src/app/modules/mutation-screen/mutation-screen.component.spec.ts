import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MutationScreenComponent } from './mutation-screen.component';
import { MatDialog } from '@angular/material/dialog';
import { MutationService } from '../../services/genetic/mutation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationMockService } from '../../services/authentication/authentication.mock.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { GeneticMock } from '../../services/genetic/genetic.mock';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';

describe('MutationScreenComponent', () => {
  let component: MutationScreenComponent;
  let fixture: ComponentFixture<MutationScreenComponent>;
  const ad: AdministrativeMock = new AdministrativeMock();
  const geneticMock: GeneticMock = new GeneticMock(ad);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MatDialogModule, TranslateModule.forRoot()],
      declarations: [ MutationScreenComponent ],
      providers: [ MatDialog, HttpClient, MutationService, MatDialog, MatSnackBar,
                   {
                      provide: AuthenticationService,
                      useClass: AuthenticationMockService,
                  }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit', () => {
    const spy = spyOn(component, 'processListMutations');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('#processListMutations', () => {
    const spy = spyOn(component.mutationService, 'listMutationPagination');
    component.ngOnInit();
    component.processListMutations();
    expect(spy).toHaveBeenCalled();
  });

  it('#ngOnDestroy', () => {
    const spy = spyOn(component.mutationSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('#addMutation', () => {
    component.ngOnInit();
    component.addMutation();
    expect(component.editing).toEqual(true);
  });

  // it('#editMutation', () => {
  //   component.editMutation(geneticMock.generateMutation('1'));
  //   expect(component.editing).toEqual(true);
  //   expect(component.editingMutation.hgvs).toEqual('hgvs1');
  // });

  // it('#sortMutations', () => {
  //   const spy = spyOn(component, 'processListMutations');
  //   component.sortMutations(null);
  //   expect(spy).toHaveBeenCalled();
  // });

  it('#backButton', () => {
    component.ngOnInit();
    component.backButton();
    expect(component.editing).toEqual(false);
  });

  /*it('#saveModelChanges', () => {
    let spy = spyOn(component, 'copyRequestValues');
    component.saveModelChanges(geneticMock.generateMutation('1'));
    expect(spy).toHaveBeenCalled();
  });*/

  // it('#copyRequestValues', () => {
  //   const dataMut: Mutation = geneticMock.generateMutation('1');
  //   const emptyMut: Mutation = new Mutation();
  //   component.copyRequestValues(dataMut, emptyMut);
  //   expect(emptyMut.hgvs).toEqual('hgvs1');
  // });

  it('#showNotification', () => {
    const spy = spyOn(component.notificationMessage, 'openFromComponent');
    component.ngOnInit();
    component.showNotification('TEST', 'test_class');
    expect(spy).toHaveBeenCalled();
  });

  // it('#toggleTableField', () => {
  //   const mut: Mutation = geneticMock.generateMutation('1');
  //   const spy = spyOn(Mutation, 'fromObject');
  //   component.ngOnInit();
  //   component.toggleTableField(mut);
  //   expect(spy).toHaveBeenCalled();
  // });

  it('#pageChanged', () => {
    const spy = spyOn(component, 'processListMutations');
    component.ngOnInit();
    component.pageChanged(null);
    expect(spy).toHaveBeenCalled();
  });

  it('#textFiltered', () => {
    const spy = spyOn(component, 'processListMutations');
    component.ngOnInit();
    component.textFiltered(null);
    expect(spy).toHaveBeenCalled();
  });

  /*it('#openDialog', () => {
    const mut: Mutation = geneticMock.generateMutation('1');
    let spy = spyOn(component.dialog, 'open');
    component.openDialog(["", mut]);
    expect(spy).toHaveBeenCalled();
  });*/

});
