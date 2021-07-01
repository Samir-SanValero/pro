import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestScreenComponent } from './request-screen.component';

const routes: Routes = [{ path: '', component: RequestScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestScreenRoutingModule { }
