import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubUserComponent } from './sub-users.component';

const routes: Routes = [
  {
    path: '',
    component: SubUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubUserRoutingModule { }
