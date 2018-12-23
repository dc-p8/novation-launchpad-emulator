import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {FormsModule} from '@angular/forms';

import {NgxElectronModule} from 'ngx-electron';
import { LaunchpadButtonComponent } from './launchpad-button/launchpad-button.component';
import { CustomColorDirective } from './CustomColorDirective';

@NgModule({
  declarations: [
    AppComponent,
    LaunchpadButtonComponent,
    CustomColorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxElectronModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
