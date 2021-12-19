import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockTransTypesComponent } from './stockTransTypes.component';

const routes: Routes = [
  {
    path: '',
    component: StockTransTypesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockTransTypesRoutingModule { }
