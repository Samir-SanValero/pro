import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiseaseScreenComponent } from './disease-screen.component';

const routes: Routes = [{ path: '', component: DiseaseScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class DiseaseScreenRoutingModule { }
