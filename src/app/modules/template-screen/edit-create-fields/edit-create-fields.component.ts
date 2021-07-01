import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TemplateService } from '../../../services/report/template.service';

@Component({
  selector: 'app-edit-create-fields',
  templateUrl: './edit-create-fields.component.html'
})
export class EditCreateFieldsComponent implements OnInit {

  fieldLabel: string;
  templateUrl: string;
  signatureUrl: string;
  isEditMode = false;
  image: any;
  position: string;
  url: string;

  constructor(
    private dialogRef: MatDialogRef<EditCreateFieldsComponent>,
    private templatesService: TemplateService
  ) { }

  ngOnInit(): void {
    this.setUrl();
  }

  setImage(event): void {
    this.image = event.srcElement.files[0];
  }

  save(): void {
    console.log('editMode: ' + this.isEditMode);
    if (this.isEditMode) {
      this.update();
    } else {
      console.log('Edit create fields SAVE FUNCTION');
      console.log('position: ' + this.position);
      console.log('image: ' + this.image);
      const element = {
        position: this.position,
        image: this.image
      };
      this.dialogRef.close(element);
    }
  }

  update(): void {
    this.templatesService.updateImage(this.url, this.image).subscribe(
      result => {
        this.dialogRef.close(this.image);
      }
    );
  }

  setUrl(): void {
    this.url = this.templateUrl + '/images/' + this.position;
  }
}
