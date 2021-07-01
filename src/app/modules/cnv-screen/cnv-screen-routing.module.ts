import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CnvScreenComponent } from './cnv-screen.component';

const routes: Routes = [{ path: '', component: CnvScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CnvScreenRoutingModule { }
