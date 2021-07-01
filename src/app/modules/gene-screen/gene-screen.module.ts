import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneScreenComponent } from './gene-screen.component';
import { FooterModule } from '../footer/footer.module';
import { MainMenuModule } from '../main-menu/main-menu.module';
import { HeaderModule } from '../header/header.module';
import { GeneScreenRoutingModule } from './gene-screen-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableModule } from '../common/table/table.module';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [GeneScreenComponent],
    imports: [
        CommonModule,
        FooterModule,
        MainMenuModule,
        HeaderModule,
        GeneScreenRoutingModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        TableModule,
        FormsModule,
        MatCardModule,
        TranslateModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatProgressSpinnerModule
    ]
})
export class GeneScreenModule { }
