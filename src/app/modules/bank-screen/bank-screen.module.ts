import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankScreenComponent } from './bank-screen.component';
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
import { BankScreenRoutingModule } from './bank-screen-routing.module';
import { TableModule } from '../common/table/table.module';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
    declarations: [BankScreenComponent],
    exports: [
        BankScreenComponent
    ],
  imports: [
    CommonModule,
    HeaderModule,
    MainMenuModule,
    FooterModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
    BankScreenRoutingModule,
    TableModule,
    MatCardModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
    bootstrap: [BankScreenComponent],
})
export class BankScreenModule { }
