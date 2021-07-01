import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupScreenComponent } from './group-screen.component';

const routes: Routes = [{ path: '', component: GroupScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupScreenRoutingModule { }
