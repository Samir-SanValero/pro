import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainScreenComponent } from './main-screen.component';
import { MainScreenRoutingModule } from './main-screen-routing.module';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { MainMenuModule } from '../main-menu/main-menu.module';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MainScreenComponent],
    imports: [
        CommonModule,
        MainScreenRoutingModule,
        HeaderModule,
        FooterModule,
        MainMenuModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatButtonModule
    ],
  bootstrap: [MainScreenComponent],
  exports: [MainScreenComponent, RouterModule]
})
export class MainScreenModule { }
