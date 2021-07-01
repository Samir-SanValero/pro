import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestScreenComponent } from './request-screen.component';
import { HeaderModule } from '../header/header.module';
import { MainMenuModule } from '../main-menu/main-menu.module';
import { FooterModule } from '../footer/footer.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RequestScreenRoutingModule } from './request-screen-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from '../common/table/table.module';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { NewRequestComponent } from './new-request/new-request.component';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [RequestScreenComponent, NewRequestComponent],
  imports: [
    CommonModule,
    HeaderModule,
    MainMenuModule,
    FooterModule,
    RequestScreenRoutingModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatSelectModule,
    MatSortModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    TableModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatRadioModule
  ],
    bootstrap: [RequestScreenComponent],
    exports: [
        RequestScreenComponent
    ]
})
export class RequestScreenModule { }
