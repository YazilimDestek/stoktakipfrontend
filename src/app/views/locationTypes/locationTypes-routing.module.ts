import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationTypesComponent } from './locationTypes.component';

const routes: Routes = [
  {
    path: '',
    component: LocationTypesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationTypesRoutingModule { }
