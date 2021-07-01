import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleScreenComponent } from './rule-screen.component';

const routes: Routes = [
  { path: '', component: RuleScreenComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleScreenRoutingModule { }
