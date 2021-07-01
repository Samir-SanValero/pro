import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { TableModule } from '../common/table/table.module';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RuleScreenComponent } from './rule-screen.component';
import {RuleScreenRoutingModule} from './rule-screen-routing.module';
import { RuleScreenDialogComponent } from './rule-screen-dialog/rule-screen-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
    declarations: [RuleScreenComponent, RuleScreenDialogComponent],
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
    TableModule,
    MatCardModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RuleScreenRoutingModule,
    MatRadioModule,
    MatExpansionModule,
    MatChipsModule
  ],
    exports: [RuleScreenComponent]
})
export class RuleScreenModule { }
