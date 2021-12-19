import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubUserRoutingModule } from './sub-users-routing.module';
import { SubUserComponent } from './sub-users.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { FieldErrorModule } from 'src/app/shared/components/field-error/field-error-display.module';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    NgbModule,
    SubUserRoutingModule,
    ReactiveFormsModule,
    TextMaskModule,
    FormsModule,
    FieldErrorModule
  ],
  declarations: [SubUserComponent]
})
export class SubUserModule { }
