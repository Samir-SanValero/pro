import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchScreenComponent } from './match-screen.component';
import { HeaderModule } from '../header/header.module';
import { MainMenuModule } from '../main-menu/main-menu.module';
import { FooterModule } from '../footer/footer.module';
import { MatchScreenRoutingModule } from './match-screen-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TableModule } from '../common/table/table.module';
import { MatchImportDialogComponent } from './match-import-dialog/match-import-dialog.component';

@NgModule({
  declarations: [MatchScreenComponent, MatchImportDialogComponent],
  imports: [
    CommonModule,
    HeaderModule,
    MainMenuModule,
    FooterModule,
    MatchScreenRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    FormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatInputModule,
    TranslateModule,
    MatRadioModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TableModule,
    ReactiveFormsModule
  ],
    bootstrap: [MatchScreenComponent]
})
export class MatchScreenModule { }
