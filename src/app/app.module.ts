import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SongHeaderComponent } from './song-header/song-header.component';
import { HomeComponent } from './home/home.component';
import { SongComponent } from './song/song.component';
import { FormsModule } from '@angular/forms';
import { BreakdownComponent } from './breakdown/breakdown.component';

@NgModule({
  declarations: [
    AppComponent,
    SongHeaderComponent,
    HomeComponent,
    SongComponent,
    BreakdownComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
