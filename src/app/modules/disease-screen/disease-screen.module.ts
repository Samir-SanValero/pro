import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiseaseScreenComponent } from './disease-screen.component';
import { HeaderModule } from '../header/header.module';
import { MainMenuModule } from '../main-menu/main-menu.module';
import { FooterModule } from '../footer/footer.module';
import { DiseaseScreenRoutingModule } from './disease-screen-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TableModule } from '../common/table/table.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [DiseaseScreenComponent],
    imports: [
        CommonModule,
        HeaderModule,
        MainMenuModule,
        FooterModule,
        DiseaseScreenRoutingModule,
        MatIconModule,
        MatButtonModule,
        TableModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatCardModule,
        TranslateModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule
    ]
})
export class DiseaseScreenModule { }
