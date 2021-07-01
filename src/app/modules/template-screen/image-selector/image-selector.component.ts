import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditCreateFieldsComponent } from '../edit-create-fields/edit-create-fields.component';
import { TemplateService } from '../../../services/report/template.service';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {

  @Input()
  position: string;

  @Input()
  title: string;

  @Input()
  image: string;

  @Input()
  templateUrl: string;

  @Input()
  isVertical = false;

  @Input()
  isViewMode = false;

  @Input()
  fieldLabel = '';

  backgroundImage = null;

  @Output()
  imageEmmit = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog,
    private templatesService: TemplateService
  ) { }

  ngOnInit(): void {
    this.image = this.image != null ? this.image : null;
  }

  openField(): void {
    const dialogRef = this.dialog.open(EditCreateFieldsComponent,
      {
        width: '500px'
      });

    dialogRef.componentInstance.position = this.position;
    dialogRef.componentInstance.fieldLabel = this.fieldLabel;

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.imageEmmit.emit(result);
          this.backgroundImage = result.image;
        }
      }
    );
  }

  delete(): void {
    if (this.templateUrl) {
      this.templatesService.deleteTemplateImage(this.templateUrl, this.position).subscribe(
        data => {
          this.backgroundImage = null;
        }
      );
    } else {
      this.backgroundImage = null;
      this.image = null;
    }
  }

}
