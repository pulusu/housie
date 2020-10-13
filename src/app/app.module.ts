import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//import { NgCircleProgressModule } from 'ng-circle-progress-day-countdown';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { CountdownModule } from 'ngx-countdown';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlaygameComponent } from './playgame/playgame.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { StartGameComponent } from './start-game/start-game.component';
 
@NgModule({
    imports: [
        BrowserModule,
        CountdownModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        CommonModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
        }),
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300,
            showTitle:false,
            showUnits:false,
            showSubtitle:false
            
          }),
        
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        DashboardComponent,
        PlaygameComponent
,
        GameHistoryComponent ,
        StartGameComponent   
    ],
    providers: [
 //       { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
   //     { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
       // fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };