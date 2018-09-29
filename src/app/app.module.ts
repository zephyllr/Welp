import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RefreshBtnComponent } from './refresh-btn/refresh-btn.component';
import { IframifyComponent } from './iframify/iframify.component';

@NgModule({
  declarations: [
    AppComponent,
    RefreshBtnComponent,
    IframifyComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
