import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemtypesComponent } from './itemtypes.component';

const routes: Routes = [
  {
    path: '',
    component: ItemtypesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemtypesRoutingModule { }
