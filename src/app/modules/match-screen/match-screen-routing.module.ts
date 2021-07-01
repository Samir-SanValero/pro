import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchScreenComponent } from './match-screen.component';

const routes: Routes = [{ path: '', component: MatchScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchScreenRoutingModule { }
