import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemkindsComponent } from './itemkinds.component';

const routes: Routes = [
  {
    path: '',
    component: ItemkindsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemkindsRoutingModule { }
