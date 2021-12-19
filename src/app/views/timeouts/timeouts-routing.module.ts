import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeOutComponent } from './timeouts.component';

const routes: Routes = [
  {
    path: '',
    component: TimeOutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeOutRoutingModule { }
