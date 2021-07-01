import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DiseaseScreenComponent } from './disease-screen.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';
import { GeneticMock } from '../../services/genetic/genetic.mock';
import { AdministrativeMock } from '../../services/administrative/administrative.mock';
import { DiseaseService } from '../../services/genetic/disease.service';
import { HttpClient, HttpHandler} from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationMockService } from '../../services/authentication/authentication.mock.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { Disease, Gene } from '../../models/genetic-model';

describe('DiseaseScreenComponent', () => {
  let component: DiseaseScreenComponent;
  let fixture: ComponentFixture<DiseaseScreenComponent>;
  const ad: AdministrativeMock = new AdministrativeMock();
  const geneticMock: GeneticMock = new GeneticMock(ad);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MatDialogModule, TranslateModule.forRoot()],
      declarations: [ DiseaseScreenComponent ],
      providers: [MatDialog, Overlay, DiseaseService, HttpClient, MatSnackBar,
                  {
                      provide: AuthenticationService,
                      useClass: AuthenticationMockService,
                  }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiseaseScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit', () => {
    const spy = spyOn(component, 'processListDiseases');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
  it('#processListDiseases', () => {
    const spy = spyOn(component.diseaseService, 'listDiseasePagination');
    component.processListDiseases();
    expect(spy).toHaveBeenCalled();
  });
  it('#editDisease', () => {
    component.editDisease(geneticMock.generateDisease('1'));
    expect(component.editing).toEqual(true);
  });
  it('#sortDiseases', () => {
    const spy = spyOn(component, 'processListDiseases');
    component.sortDiseases(null);
    expect(spy).toHaveBeenCalled();
  });
  it('#backButton', () => {
    component.backButton();
    expect(component.editing).toEqual(false);
  });
  /*it('#saveModelChanges', () => {
    component.saveModelChanges()
  });*/
  it('#copyRequestValues', () => {
    const dataDis: Disease = geneticMock.generateDisease('3');
    const emptyDis: Disease = new Disease();
    component.copyRequestValues(dataDis, emptyDis);
    expect(emptyDis.omim).toEqual(dataDis.omim);
  });
  it('#showNotification', () => {
    const spy = spyOn(component.notificationMessage, 'openFromComponent');
    component.showNotification('TEST', 'test_class');
    expect(spy).toHaveBeenCalled();
  });
  it('#addLanguage', () => {
    component.editDisease(geneticMock.generateDisease('1'));
    const spy = spyOn(component.editingDisease.translations, 'forEach');
    component.addLanguage('test');
    expect(spy).toHaveBeenCalled();
  });
  /*it('#associateNewGene', () => {
      const spy = spyOn(component.geneService, 'getGeneByName');
      component.associateNewGene("test");
      expect(spy).toHaveBeenCalled();
    });
  it('#disassociateGene', () => {
      component.disassociateGene(null);
    });*/
  it('#displayGeneInList', () => {
      const gene: Gene = geneticMock.generateGene('6');
      const result = component.displayGeneInList(gene);
      expect(result).toEqual(gene.geneName);
    });
  it('#filterGenes', () => {
      const result = component.filterGenes('test');
      expect(result.length).toEqual(0);
    });
  /*it('#filterTable', () => {
      component.
    });*/
  it('#pageChanged', () => {
    const spy = spyOn(component, 'processListDiseases');
    component.pageChanged(null);
    expect(spy).toHaveBeenCalled();
  });
  /*it('#textFiltered', () => {
      component.textFiltered(null);
    });*/
});
