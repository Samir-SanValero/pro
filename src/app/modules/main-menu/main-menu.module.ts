import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from './main-menu.component';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MainMenuComponent],
  exports: [
    MainMenuComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        MatListModule,
        TranslateModule
    ]
})
export class MainMenuModule { }
