import { FieldErrorDisplayComponent } from './field-error-display.component';


/**Angular Modules */

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/**Component Modules */
/**Plugin Modules */
import { TextMaskModule } from 'angular2-text-mask';






@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    TextMaskModule,
    FormsModule,  
  ],
  declarations: [ FieldErrorDisplayComponent ],
  providers: [],
  exports: [FieldErrorDisplayComponent]
  
})
export class FieldErrorModule { }
