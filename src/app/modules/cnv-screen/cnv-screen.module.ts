import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnvScreenComponent } from './cnv-screen.component';
import { HeaderModule } from '../header/header.module';
import { MainMenuModule } from '../main-menu/main-menu.module';
import { FooterModule } from '../footer/footer.module';
import { CnvScreenRoutingModule } from './cnv-screen-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TableModule } from '../common/table/table.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [CnvScreenComponent],
    imports: [
        CommonModule,
        HeaderModule,
        MainMenuModule,
        FooterModule,
        CnvScreenRoutingModule,
        MatIconModule,
        MatButtonModule,
        TableModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatCardModule,
        TranslateModule,
        MatCheckboxModule,
        MatProgressSpinnerModule
    ]
})
export class CnvScreenModule { }
