import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatTableModule,
        MatInputModule,
        MatPaginatorModule,
        MatButtonModule,
        TranslateModule
    ],
  exports: []
})
export class ConfirmDialogModule { }
