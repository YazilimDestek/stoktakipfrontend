import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FieldErrorModule } from 'src/app/shared/components/field-error/field-error-display.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FieldErrorModule
  ],
  declarations: [UserProfileComponent]
})
export class ProfileModule { }
