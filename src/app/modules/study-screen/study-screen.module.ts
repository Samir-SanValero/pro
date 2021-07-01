import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyScreenComponent } from './study-screen.component';
import { HeaderModule } from '../header/header.module';
import { MainMenuModule } from '../main-menu/main-menu.module';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [StudyScreenComponent],
    imports: [
        CommonModule,
        HeaderModule,
        MainMenuModule,
        FooterModule
    ]
})
export class StudyScreenModule { }
