import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateScreenComponent } from './template-screen.component';
import { MainMenuModule } from '../main-menu/main-menu.module';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TableModule } from '../common/table/table.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TemplateScreenRoutingModule } from './template-screen-routing.module';
import { SignaturesComponent } from './signatures/signatures.component';
import { TemplatesCreateEditViewComponent } from './templates-create-edit-view/templates-create-edit-view.component';
import { EditCreateSignaturesFieldsComponent } from './signatures/edit-create-signatures-fields/edit-create-signatures-fields.component';
import { EditCreateFieldsComponent } from './edit-create-fields/edit-create-fields.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import {ImagesComponent} from '../shared/images/images.component';



@NgModule({
  declarations: [
    TemplateScreenComponent,
    SignaturesComponent,
    TemplatesCreateEditViewComponent,
    EditCreateSignaturesFieldsComponent,
    EditCreateFieldsComponent,
    ImageSelectorComponent,
    ImagesComponent
  ],
  imports: [
    CommonModule,
    MainMenuModule,
    FooterModule,
    HeaderModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    TableModule,
    TranslateModule,
    MatIconModule,
    MatCardModule,
    TemplateScreenRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    FlexModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class TemplateScreenModule { }
