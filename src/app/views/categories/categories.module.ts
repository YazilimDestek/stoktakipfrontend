import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { FieldErrorModule } from 'src/app/shared/components/field-error/field-error-display.module';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    NgbModule,
    CategoriesRoutingModule,
    ReactiveFormsModule,
    ColorPickerModule,
    FormsModule,
    FieldErrorModule
  ],
  declarations: [CategoriesComponent]
})
export class CategoriesModule { }
