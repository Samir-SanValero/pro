import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankScreenComponent } from './bank-screen.component';

const routes: Routes = [{ path: '', component: BankScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankScreenRoutingModule { }
