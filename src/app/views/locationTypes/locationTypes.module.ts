import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationTypesRoutingModule } from './locationTypes-routing.module';
import { LocationTypesComponent } from './locationTypes.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { FieldErrorModule } from 'src/app/shared/components/field-error/field-error-display.module';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    NgbModule,
    LocationTypesRoutingModule,
    ReactiveFormsModule,
    TextMaskModule,
    FieldErrorModule
  ],
  declarations: [LocationTypesComponent]
})
export class LocationTypesModule { }
