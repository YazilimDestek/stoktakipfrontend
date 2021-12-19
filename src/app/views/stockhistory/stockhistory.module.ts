import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './stockhistory-routing.module';
import { StockHistoryComponent } from './stockhistory.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    NgbModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedPipesModule
  ],
  declarations: [StockHistoryComponent]
})
export class StockHistoryModule { }
