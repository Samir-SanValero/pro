import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MutationScreenComponent } from './mutation-screen.component';

const routes: Routes = [{ path: '', component: MutationScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MutationScreenRoutingModule { }
