import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AppConfig } from './app.config';
import { DatePipe } from '@angular/common';
import { FieldErrorModule } from './shared/components/field-error/field-error-display.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    
    HttpModule,
    FieldErrorModule,
    BrowserModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }),
    AppRoutingModule
  ],
  providers: [AppConfig,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
