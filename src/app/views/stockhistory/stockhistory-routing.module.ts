import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockHistoryComponent } from './stockhistory.component';

const routes: Routes = [
  {
    path: '',
    component: StockHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
