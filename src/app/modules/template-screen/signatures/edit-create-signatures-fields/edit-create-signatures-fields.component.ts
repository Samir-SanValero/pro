import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {SignatureService} from '../../../../services/report/signature.service';

@Component({
  selector: 'app-edit-create-signatures-fields',
  templateUrl: './edit-create-signatures-fields.component.html'
})
export class EditCreateSignaturesFieldsComponent implements OnInit {

  fieldLabel: string;
  isEditMode = false;
  isFromDb = false;
  templateUrl: string;
  image: File = null;
  signature = null;
  form: FormGroup;
  createMode = false;

  constructor(
      private signatureService: SignatureService,
      public dialogRef: MatDialogRef<EditCreateSignaturesFieldsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.isEditMode = this.data.isEditMode ? this.data.isEditMode : false;
    this.createMode = this.data.createMode ? this.data.createMode : false;
    this.isFromDb = this.data.isFromDb ? this.data.isFromDb : false;
    this.image = this.data.image;
    this.templateUrl = this.data.templateUrl;

    this.fieldLabel = this.data.fieldLabel;
    if (this.createMode) {
      this.signature = {
        name: '',
        rol: '',
        position: 0,
        additionalInfo: ''
      };
    } else {
      this.signature = this.data.signature;
    }
    this.prepareForm();
  }

  setImage(event): void {
    this.image = event.srcElement.files[0];
  }

  prepareForm(): void {
    this.form = new FormGroup({
      name: new FormControl(this.signature.name, [Validators.required]),
      rol: new FormControl(this.signature.rol),
      position: new FormControl(this.signature.position),
      additionalInfo: new FormControl(this.signature.additionalInfo)
    });

  }

  // 1 que este creando una template
  // 2 que este editando una templat
  save(data: any): void {
    const element = { signature: data, image: this.image };
    if (this.createMode || !this.isFromDb) {
      // Si me pasan la url de la plantilla voy a crear una signature para esa plantilla
      if (this.templateUrl) {
        this.create(element);
      } else {
        // Si no hay url de la plantilla solo voy a emitir el elemento alamacenado en memoria
        this.dialogRef.close(element);
      }
    } else {
      this.update(element);
    }
  }

  create(element: any): void {
    this.signatureService.createSignature(this.templateUrl, element.signature).subscribe(
      result => {
        this.uploadSignatureImage(result, element.image);
      }
    );
  }

  uploadSignatureImage(signature: any, file: File): void {
    const signatureUrl = signature._links.self.href;
    this.signatureService.uploadSignatureImage(signatureUrl, file).subscribe(
      result => {
        this.dialogRef.close(result);
      }
    );
  }

  update(element: any): void {
    this.signatureService.updateSignature(this.templateUrl, element.signature).subscribe(
      result => {
        this.dialogRef.close(result);
      }
    );
  }

}
