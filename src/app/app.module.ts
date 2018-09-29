import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RefreshBtnComponent } from './refresh-btn/refresh-btn.component';
import { IframifyComponent } from './iframify/iframify.component';
import { MapComponent } from './map/map.component';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    RefreshBtnComponent,
    IframifyComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBXZmFMK2q6CjtNj9QVlIWZ_-CAwe4rE7I'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
