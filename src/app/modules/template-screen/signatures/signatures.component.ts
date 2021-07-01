import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditCreateSignaturesFieldsComponent } from './edit-create-signatures-fields/edit-create-signatures-fields.component';
import { SignatureService } from '../../../services/report/signature.service';
import { Signature } from '../../../models/report-model';

@Component({
  selector: 'app-signatures',
  templateUrl: './signatures.component.html',
  styleUrls: ['./signatures.component.scss']
})
export class SignaturesComponent {

  @Input()
  signatures: any[] = [];

  @Input()
  isViewMode = false;

  @Input()
  isEditTemplateMode = false;

  @Input()
  templateUrl: string = null;

  title = 'Signature';

  dialogRef: MatDialogRef<EditCreateSignaturesFieldsComponent>;

  signaturesToUpload: any[] = [];

  @Output()
  emittsignaturesToUpload = new EventEmitter<any>();

  @Output()
  syncDataEmit = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private signatureService: SignatureService) { }

  create(): void {
    this.dialogRef = this.dialog.open(EditCreateSignaturesFieldsComponent,
      {
        width: '500px',
        data: {
          fieldLabel: 'Add signature',
          createMode: true,
          templateUrl: this.templateUrl,
        }
      });

    this.dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (this.templateUrl) {
            this.syncDataEmit.emit();
          } else {
            this.signaturesToUpload.push(result);
            this.emittsignaturesToUpload.emit(this.signaturesToUpload);
          }
        }
      }
    );
  }

  edit(signature: any, index: number, isFromDb: boolean): void {
    const signatureToEdit = isFromDb ? signature : signature.signature;
    this.dialogRef = this.dialog.open(EditCreateSignaturesFieldsComponent,
      {
        width: '500px',
        data: {
          fieldLabel: 'Edit signature',
          isEditMode: true,
          templateUrl: this.templateUrl,
          isFromDb: { isFromDb },
          signature: signatureToEdit,
          image: isFromDb ? null : this.signaturesToUpload[index].image
        }
      });

    this.dialogRef.afterClosed().subscribe(
      result => {
        if (result) {

          if (isFromDb) {
            this.signatures[index] = result.signature;
          }
          else {
            this.signaturesToUpload[index] = result;
          }
        }
      }
    );
  }

  delete(signature: Signature, index: number): void {
    // Si borro signatures dentro de una plantilla creada entonces borro directamente de la bd
    if (this.templateUrl) {
      this.signatureService.deleteSignature(signature).subscribe(
        data => {
          // Mando a actualizar todos los datos denuevo
          this.syncDataEmit.emit();
        }
      );
    }
    else {
      // Si la signature solo esta en memoria la sustraigo de signaturesToUpload
      this.signaturesToUpload.splice(index, 1);
    }
  }
}
