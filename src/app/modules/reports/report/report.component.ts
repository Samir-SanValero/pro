import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Requestor } from 'src/app/models/requestor.model';
import { UncoveredData } from 'src/app/models/uncoveredData.model';
import { VariantData } from 'src/app/models/variantData.model';
import { MatTableDataSource } from '@angular/material/table';
import { DataComponent } from './data/data.component';
import { TemplateService } from '../../../services/report/template.service';
import { ReportsService } from '../../../services/report/reports.service';
import { environment } from '../../../../environments/environment';
import { SampleType, Template } from '../../../models/report-model';
import { Subscription } from 'rxjs';
import { Pagination } from '../../../models/common-model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
  pagination: Pagination;

  individualMode = false;
  coupleMode = false;
  oneDonorMode = false;

  individual: any = {};
  couple: any = {};
  oneDonor: Requestor = {};

  form: FormGroup;
  title = '';
  templates: Template[];
  languages: any[];
  variantsDataColumns: any[];
  uncoveredDataColumns: any[];
  variantsDataSource: MatTableDataSource<VariantData[]>;
  uncoveredDataSource: MatTableDataSource<UncoveredData[]>;
  currentLang: string;
  sampleTypes: Array<SampleType>;
  templateSelected: any = { name: '' };
  languageSelected: any = { code: '' };
  uncoveredData: UncoveredData[] = [];
  variantsData: VariantData[] = [];
  dialogRefData: MatDialogRef<DataComponent>;
  geneticRisks: any;

  templateSubscription: Subscription;
  acceptedLanguagesSubscription: Subscription;
  acceptedSampleTypesSubscription: Subscription;

  constructor(public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ReportComponent>,
              private formBuilder: FormBuilder,
              private reportsService: ReportsService,
              private templatesService: TemplateService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.currentLang = this.translate.currentLang;
    this.setMode();
    this.syncData();
  }

  ngOnDestroy() {
    if (this.templateSubscription !== undefined) {
      this.templateSubscription.unsubscribe();
    }

    if (this.acceptedLanguagesSubscription !== undefined) {
      this.acceptedLanguagesSubscription.unsubscribe();
    }

    if (this.acceptedSampleTypesSubscription !== undefined) {
      this.acceptedSampleTypesSubscription.unsubscribe();
    }
  }

  syncData(): void {
    this.setLanguages();
    this.setTemplates();
    this.setSampleTypes();
    // this.setGeneticRisks();
  }

  setMode(): void {
    switch (this.data.mode) {
      case 'individual':
        this.setIndividual();
        break;
      case 'couple':
        this.setCouple();
        break;
      case 'oneDonor':
        this.setOneDonor();
        break;
    }
  }

  setCouple(): void {
    this.coupleMode = true;
    this.couple = this.data.info;
    this.title = 'REPORTS.TITLE_COUPLE';
    const values: FormGroup = this.setCoupleValues(this.couple);
    this.form = this.formBuilder.group(values);
    // this.setLanguageSelected(this.couple);
    // this.setTemplateSelected(this.couple);
  }

  setIndividual(): void {
    this.individualMode = true;
    this.individual = this.data.info;
    this.title = 'REPORTS.TITLE_INDIVIDUAL';
    const values: FormGroup = this.setIndividualValues(this.individual);
    this.form = this.formBuilder.group(values);
    this.disableFields(['name', 'urCode']);
    // this.setLanguageSelected(this.individual);
    // this.setTemplateSelected(this.individual);
  }

  setOneDonor(): void {
    this.oneDonorMode = true;
    this.oneDonor = this.data.info;
    this.title = 'REPORTS.TITLE_ONE_DONOR';
    const values: FormGroup = this.setDonorValues(this.oneDonor);
    this.form = this.formBuilder.group(values);
    this.disableFields(['name', 'urCode']);
    // this.setLanguageSelected(this.oneDonor);
    // this.setTemplateSelected(this.oneDonor);
  }

  setTargetReportSelected(event, index): void {
    this.oneDonor.matchResultData.matchTargetReports[index].selected = event;
  }

  setDonorValues(data: any): any {
    const entity: Requestor = new Requestor(data);
    const requestor = this.setRequestorValues(entity);
    const person = this.setPersonValues(entity);

    const matchResultData = { matchResultData: entity.matchResultData };

    return { ...requestor, ...person, ...matchResultData };
  }

  setIndividualValues(data: any): any {
    const entity = data as Requestor;
    const requestor = this.setRequestorValues(entity);
    const person = this.setPersonValues(entity);
    this.setVariantsData(entity.variantsData);
    this.setUncoveredData(entity.uncoveredData);

    return { ...requestor, ...person };
  }

  setGeneticRisks(): void {
    this.reportsService.getGeneticRisks().subscribe(result => {
      this.geneticRisks = result._embedded['precon:geneticRisks'];
    });
  }

  setCoupleValues(data: any): any {
    const entity: Requestor = new Requestor(data);
    const requestor = this.setRequestorValues(entity);

    if (entity !== undefined) {
      let womanElement;
      let manElement;
      if (entity.woman !== undefined) {
        womanElement = this.formBuilder.group(this.setPersonValues(entity.woman));
      }

      if (entity.man !== undefined) {
        manElement = this.formBuilder.group(this.setPersonValues(entity.man));
      }

      let woman;
      if (womanElement !== undefined && womanElement !== null) {
        woman = { woman: this.formBuilder.group(this.setPersonValues(entity.woman)) };
      }

      let man;
      if (manElement !== undefined && manElement !== null) {
        man = { man: this.formBuilder.group(this.setPersonValues(entity.man)) };
      }

      return { ...requestor, ...woman, ...man };
    }
    return undefined;
  }

  setTemplateSelected(data: any): void {
    const templateRelationUrl = data._links['precon:template'].href;
    this.reportsService.getTemplate(templateRelationUrl).subscribe((result: any) => {
      this.templateSelected = result._links.self.href;
    });
  }

  setLanguageSelected(data: any): void {
    const languageRelationUrl = data._links['precon:language'].href;
    this.reportsService.getLanguage(languageRelationUrl).subscribe(result => {
      this.languageSelected = result._links.self.href;
    });
  }

  disableFields(fields: string[]): void {
    fields.forEach(field => {
      let fieldElement = this.form.get(field);
      if (fieldElement !== null) {
        fieldElement.disable();
      }
    });
  }

  setVariantsData(data: VariantData[]): void {
    this.variantsDataColumns = [
      { name: 'REPORTS.DATA_DISEASE_NAME', colname: 'diseaseName' },
      { name: 'REPORTS.DATA_DISEASE_DESCRIPTION', colname: 'diseaseDescription' },
      { name: 'REPORTS.DATA_CHROMOSOME', colname: 'chromosome' },
      { name: 'REPORTS.DATA_GENE_NAME', colname: 'geneName' },
      { name: 'REPORTS.DATA_REGION', colname: 'region' },
      { name: 'REPORTS.DATA_HGVS', colname: 'hgvs' },
      { name: 'REPORTS.DATA_MUTATION_TYPE', colname: 'mutationType' },
      { name: 'REPORTS.DATA_TRANSCRIPT', colname: 'transcript' },
      { name: 'REPORTS.DATA_ORDER', colname: 'order' },
      { name: 'REPORTS.DATA_REFERENCE', colname: 'reference' }
    ];
    this.variantsData = data;
    this.variantsDataSource = new MatTableDataSource<any>(this.variantsData);
  }

  setUncoveredData(data: UncoveredData[]): void {
    this.uncoveredDataColumns = [
      { name: 'REPORTS.DATA_DISEASE_NAME', colname: 'diseaseName' },
      { name: 'REPORTS.DATA_CHROMOSOME', colname: 'chromosome' },
      { name: 'REPORTS.DATA_GENE_NAME', colname: 'geneName' },
      { name: 'REPORTS.DATA_HGVS', colname: 'hgvs' },
      { name: 'REPORTS.DATA_TRANSCRIPT', colname: 'transcript' }
    ];

    this.uncoveredData = data;
    this.uncoveredDataSource = new MatTableDataSource<any>(this.uncoveredData);
  }

  setPersonValues(entity: Requestor): any {
    let country: string;
    let ethnicity: string;

    if (entity.request !== undefined) {
      if (entity.request.country !== undefined) {
        if (entity.request.country.translations !== undefined) {
          for (const countryTranslation of entity.request.country.translations) {
            if (this.translate.currentLang.toLowerCase() === countryTranslation.language.toLowerCase()) {
              country = countryTranslation.name;
            }
          }

          if (country === undefined) {
            country = entity.request.country.translations[0].name;
          }
        }
      }

      if (entity.request.ethnicity !== undefined) {
        if (entity.request.ethnicity.translations !== undefined) {
          for (const ethnicityTranslation of entity.request.ethnicity.translations) {
            if (this.translate.currentLang.toLowerCase() === ethnicityTranslation.language.toLowerCase()) {
              ethnicity = ethnicityTranslation.name;
            }
          }

          if (ethnicity === undefined) {
            ethnicity = entity.request.ethnicity.translations[0].name;
          }
        }
      }

      return {
        name: [entity.request.firstName + ' ' + entity.request.lastName],
        idCard: [entity.request.idCard],
        birthDate: [entity.request.birthday],
        ethnicity: ethnicity,
        extRef: [entity.request.extCode],
        urCode: [entity.request.urCode],
        entranceDate: [entity.request.receptionDate],
        country: country,
        sampleType: [entity.sampleType],
        indication: [entity.indication]
      };
    }
  }

  setRequestorValues(entity: Requestor): any {
    return {
      requestorName: [entity.requestorName],
      reportReceiver: [entity.reportReceiver],
      hospital: [entity.hospital],
      department: [entity.department],
      variantsData: [entity.variantsData],
      uncoveredData: [entity.uncoveredData],
      resultsRiskResult: [entity.resultsRiskResult],
      matchResultData: [entity.matchResultData],
      showExtCodeSource: [entity.showExtCodeSource],
      showExtCodeTargets: [entity.showExtCodeTargets]
    };
  }

  setLanguages(): void {
    this.acceptedLanguagesSubscription = this.reportsService.getLanguages().subscribe(result => {
      this.languages = result._embedded['precon:languages'];
    });
  }

  setSampleTypes(): void {
    this.acceptedSampleTypesSubscription = this.reportsService.getSampleTypes(this.translate.currentLang.toLowerCase()).subscribe(result => {
      this.sampleTypes = result._embedded['precon:sampleTypes'];

      for (let type of this.sampleTypes) {
        console.log('SAMPLETYPE' + type.value);
      }
    });
  }

  setTemplates(): void {
    console.log('Report screen - setTemplates')
    const obs = this.templatesService.listTemplatePagination(this.pagination);
    if (obs !== null && obs !== undefined) {
      this.templateSubscription = obs.subscribe((templateData) => {
        if (templateData._embedded !== undefined) {
          this.templates = templateData._embedded[environment.linkTemplateModelList] as Array<Template>;

          const templateList = new Array<Template>();
          for (const template of this.templates) {
            templateList.push(Template.fromObject(template));
          }
          this.templates = templateList;
          console.log('Report screen - recovered templates: ' + this.templates);
          if (templateData.page !== undefined) {
            this.pagination.currentPag = templateData.page.number;
            this.pagination.numberOfPages = templateData.page.totalPages;
            this.pagination.totalElements = templateData.page.totalElements;
          }
        }
      });
    }
  }

  resetForm(): void {
    this.form.reset();
    if (this.oneDonorMode) {
      this.oneDonor.matchResultData.matchTargetReports.forEach(element => {
        element.selected = false;
      });
    }
  }

  generateReport(data): void {
    console.log(data);
    this.reportsService.generateReport(data).subscribe(result => {
      console.log(result);
    });
  }

  deleteUncoveredData(element): void {
    const index = this.uncoveredData.indexOf(element);
    this.uncoveredData.splice(index, 1);
    this.uncoveredDataSource = new MatTableDataSource<any>(this.uncoveredData);
  }

  deleteVariantData(element): void {
    const index = this.uncoveredData.indexOf(element);
    this.variantsData.splice(index, 1);
    this.variantsDataSource = new MatTableDataSource<any>(this.variantsData);
  }

  addVariantData(): void {
    this.dialogRefData = this.dialog.open(DataComponent, {
      width: '500px',
      data: {
        isVariant: true,
        title: 'REPORTS.DATA_ADD_VARIANT'
      }
    });

    this.dialogRefData.afterClosed().subscribe(
      data => {
        if (data) {
          this.variantsData.push(data);
          this.variantsDataSource = new MatTableDataSource<any>(this.variantsData);
        }
      }
    );
  }

  addUncoveredData(): void {
    this.dialogRefData = this.dialog.open(DataComponent, {
      width: '500px',
      data: {
        isUncovered: true,
        title: 'REPORTS.DATA_ADD_UNCOVERED'
      }
    });

    this.dialogRefData.afterClosed().subscribe(
      data => {
        if (data) {
          this.uncoveredData.push(data);
          this.uncoveredDataSource = new MatTableDataSource<any>(this.uncoveredData);
        }
      }
    );
  }

  updateTemplateReport(templateUrl): void {
    this.reportsService.updateTemplateReport(templateUrl).subscribe(result => {
      this.syncData();
    });
  }

  updateLangReport(languageUrl): void {
    this.reportsService.updateLanguageReport(languageUrl).subscribe(result => {
      this.syncData();
    });
  }

}
