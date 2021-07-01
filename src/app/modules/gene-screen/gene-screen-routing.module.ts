import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneScreenComponent } from './gene-screen.component';

const routes: Routes = [{ path: '', component: GeneScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneScreenRoutingModule { }
