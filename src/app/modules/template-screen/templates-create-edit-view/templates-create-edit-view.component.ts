import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { SignatureService } from '../../../services/report/signature.service';
import { SignatureObj } from '../../../models/signatureObj.model';
import { TemplateService } from '../../../services/report/template.service';
import {Template} from '../../../models/report-model';

@Component({
  selector: 'app-templates-create-edit-view',
  templateUrl: './templates-create-edit-view.component.html',
  styleUrls: ['./templates-create-edit-view.component.scss']
})
export class TemplatesCreateEditViewComponent implements OnInit {

  editMode = false;
  viewMode = false;
  createMode = false;

  // Dialog title
  title: string;

  // Service template 1
  template: any = null;

  // Service Faborite template 2
  groupCode: any = { code: '-', lang: 'ES' };

  // Service signaturess 3
  signatures: any[];

  // Service images 4
  templateImages: any;

  form: FormGroup;

  templateUrl: any = null;

  leftImage: string = null;
  rightImage: string = null;
  lateralImage: string = null;
  backgroundImage: string = null;

  signaturesToUpload: SignatureObj[] = [];

  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any,
              private signatureService: SignatureService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<TemplatesCreateEditViewComponent>,
              private templatesService: TemplateService) {
    this.signatures = [];
  }

  ngOnInit(): void {
    this.editMode = this.data.editMode != null ? this.data.editMode : false;
    this.createMode = this.data.createMode != null ? this.data.createMode : false;
    this.viewMode = this.data.viewMode != null ? this.data.viewMode : false;

    if (this.createMode) {
      this.title = 'TEMPLATES.DIALOG.NEW';
      this.template = {
        name: '',
        version: 1,
        companyName: '',
        companyAddress: '',
        companyPhones: '',
        companyElectronicAddress: ''
      };
    }

    if (this.editMode || this.viewMode) {
      this.title = 'TEMPLATES.DIALOG.EDIT';
      this.template = this.data.template as Template;
      this.templateUrl = this.template._links.self.href;
      this.syncData('');
    }
    this.prepareForm();
    this.prepareTemplateImages();
    this.setTitle();
  }

  syncData(event: any): void {
    this.readTemplateSignatures();
    this.setTemplateImages();
  }

  setTemplateImages(): void {
    const links = this.template._links;
    this.leftImage = links['precon:left-image'];
    this.rightImage = links['precon:right-image'];
    this.lateralImage = links['precon:lateral-image'];
    this.backgroundImage = links['precon:background-image'];
  }

  setTitle(): void {
    if (this.viewMode) {
      this.title = this.template.name;
    }
  }

  prepareForm(): void {
    this.form = this.formBuilder.group({
      name: [{ value: this.template.name, disabled: this.viewMode }, Validators.required],
      version: [{ value: this.template.version, disabled: true }],
      companyName: [{ value: this.template.companyName, disabled: this.viewMode }, Validators.required],
      companyAddress: [{ value: this.template.companyAddress, disabled: this.viewMode }],
      companyPhones: [{ value: this.template.companyPhones, disabled: this.viewMode }],
      companyElectronicAddress: [{ value: this.template.companyElectronicAddress, disabled: this.viewMode }],
      groupCode: [{ value: this.groupCode.code, disabled: true }],
      links: [this.template.links]
    });
  }

  setImage(element): void {
    this.templateImages[element.position] = element;
  }

  setSignaturesToUpload(signatures): void {
    this.signaturesToUpload = signatures;
  }

  prepareTemplateImages(): void {
    this.templateImages = {
      left_image: '',
      right_image: '',
      lateral_image: '',
      background_image: ''
    };
  }

  updateTemplate(formData: any): void {
    this.templatesService.updateTemplate(this.templateUrl, formData).subscribe(
      result => {
        this.dialogRef.close(true);
      }, error => {
        this.dialogRef.close(false);
      }
    );
  }

  createTemplate(formData: any): void {
    this.templatesService.createTemplate(formData).subscribe(
      template => {
        const newTemplateUrl = template._links.self.href;
        this.createLinks(newTemplateUrl).subscribe(
          result => {
            this.dialogRef.close(true);
          }, error => {
            console.log(error);
          }
        );
      }, error => {
        this.dialogRef.close(false);
      }
    );
  }

  // Primero salvamos las signatures
  // Añado las imagenes de la signature al batch
  // Concateno las peticiones de subida de las template images al batch
  // devuelvo el batch
  createLinks(templateUrl: any): Observable<any[]> {
    let batch = [];
    this.saveSignatures(templateUrl).subscribe((responses: any[]) => {
      responses.forEach((signature, index) => {
        const signatureUrl = signature._links.self.href;
        batch.push(this.signatureService.uploadSignatureImage(signatureUrl, this.signaturesToUpload[index].image));
      });
    }, error => {
      console.log(error);
    });

    batch = batch.concat(this.batchObservablesImages(templateUrl));
    return forkJoin(batch);
  }

  saveSignatures(url: string): Observable<any[]> {
    const templateId = url.split('/')[4];
    return forkJoin(this.signaturesToUpload.map(
      signatureObj => {
        return this.signatureService.createSignature(templateId, signatureObj.signature);
      }));
  }

  batchObservablesImages(url: string): any[] {
    return Object.values(this.templateImages).filter((element: any) => element && element.image !== '').map(
      (element: any) => {
        return this.templatesService.uploadTemplateImage(url, element.position, element.image);
      }
    );
  }

  readTemplateSignatures(): void {
    const templateId = this.templateUrl.split('/')[4];
    this.signatureService.getTemplateSignatures(templateId).subscribe(
      (result: any) => {
        this.signatures = result._embedded['precon:signatures'];
      }, error => {
        console.log(error);
      }
    );
  }

}
