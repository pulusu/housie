﻿import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//import { NgCircleProgressModule } from 'ng-circle-progress-day-countdown';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CountdownModule } from 'ngx-countdown';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlaygameComponent } from './playgame/playgame.component';
 
@NgModule({
    imports: [
        BrowserModule,
        CountdownModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300,
            
          }),
        
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        DashboardComponent,
        PlaygameComponent
    
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
       // fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };