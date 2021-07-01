import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GeneScreenComponent } from './gene-screen.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationMockService } from '../../services/authentication/authentication.mock.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { GeneticMock } from '../../services/genetic/genetic.mock';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';
import { Gene } from '../../models/genetic-model';

describe('GeneScreenComponent', () => {
  let component: GeneScreenComponent;
  let fixture: ComponentFixture<GeneScreenComponent>;
  const ad: AdministrativeMock = new AdministrativeMock();
  const geneticMock: GeneticMock = new GeneticMock(ad);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([]),
          MatDialogModule,
          TranslateModule.forRoot()],
      declarations: [ GeneScreenComponent ],
      providers: [ HttpClient, MatDialog, Overlay, MatSnackBar, GeneticMock, AdministrativeMock,
      {
          provide: AuthenticationService,
          useClass: AuthenticationMockService,
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
      expect(component).toBeTruthy();
  });

  it('#ngOnInit', () => {
      component.ngOnInit();
      expect(component.pagination).not.toBeNull();
      expect(component.editing).toEqual(false);
    });
  it('#processListGenes', () => {
      const spy = spyOn(component.geneService, 'listGenesPagination');
      component.processListGenes();
      expect(spy).toHaveBeenCalled();
  });
  it('#ngOnDestroy', () => {
      const spy = spyOn(component.geneSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });
  it('#addGene', () => {
      component.addGene();
      expect(component.editing).toEqual(true);
    });
  it('#editGene', () => {
      component.editGene(geneticMock.generateGene('2'));
      expect(component.editing).toEqual(true);
      expect(component.editingGene.geneName).toEqual('geneName2');
    });
  it('#sortGenes', () => {
      const spy = spyOn(component, 'processListGenes');
      component.sortGenes(null);
      expect(spy).toHaveBeenCalled();
    });
  it('#backButton', () => {
      component.backButton();
      expect(component.editing).toEqual(false);
    });
  it('#copyRequestValues', () => {
    const newGene: Gene = new Gene();
    const oldGene: Gene = geneticMock.generateGene('3');
    component.copyRequestValues(oldGene, newGene);
    expect(newGene.geneName).toEqual('geneName3');
    });
  it('#showNotification', () => {
      const spy = spyOn(component.notificationMessage, 'openFromComponent');
      component.showNotification('TEST', 'test_class');
      expect(spy).toHaveBeenCalled();
    });
  it('#pageChanged', () => {
      const spy = spyOn(component, 'processListGenes');
      component.pageChanged(null);
      expect(spy).toHaveBeenCalled();
    });
});
