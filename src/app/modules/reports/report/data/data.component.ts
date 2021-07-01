import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  title = '';
  isVariant = false;
  isUncovered = false;
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<DataComponent>,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.syncData();
  }

  syncData(): void {
    this.isVariant = this.data.isVariant || false;
    this.isUncovered = this.data.isUncovered || false;
    this.title = this.data.title;
    this.setForm();
  }

  setForm(): void {
    if (this.isUncovered) {
      this.setUncoveredDataForm();
    } else {
      this.setVariantDataForm();
    }
  }

  setVariantDataForm(): void {
    this.form = this.formBuilder.group({
      diseaseName: '',
      diseaseDescription: '',
      chromosome: '',
      geneName: '',
      region: '',
      hgvs: '',
      mutationType: '',
      transcript: '',
      order: '',
      reference: ''
    });
  }

  setUncoveredDataForm(): void {
    this.form = this.formBuilder.group({
      diseaseName: '',
      chromosome: '',
      geneName: '',
      hgvs: '',
      transcript: ''
    });
  }

  save(data): void {
    console.log('SAVE REPORT');


    this.dialogRef.close(data);
  }

}
