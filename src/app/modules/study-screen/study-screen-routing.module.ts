import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudyScreenComponent } from './study-screen.component';

const routes: Routes = [{ path: '', component: StudyScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyScreenRoutingModule { }
