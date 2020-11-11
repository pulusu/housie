import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//import { NgCircleProgressModule } from 'ng-circle-progress-day-countdown';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { CountdownModule } from 'ngx-countdown';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from "@mat-datetimepicker/core";
import { MatMenuModule} from '@angular/material/menu';

// used to create fake backend

 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlaygameComponent } from './playgame/playgame.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { StartGameComponent } from './start-game/start-game.component';
import { AdminUserComponent } from './admin-user/admin-user.component';;
import { TournamentAddComponent } from './tournament-add/tournament-add.component';
import { TournamentListComponent } from './tournament-list/tournament-list.component' ;
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TournamentsListAdminComponent } from './tournaments-list-admin/tournaments-list-admin.component';
import { TournamentsEditAdminComponent } from './tournaments-edit-admin/tournaments-edit-admin.component';
import { MytournamentsComponent }  from './mytournaments/mytournaments.component';
import { MyTournamentDetailsComponent } from './my-tournament-details/my-tournament-details.component';


import { from } from 'rxjs';

@NgModule({
    imports: [
        BrowserModule,
        CountdownModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        CommonModule,
        MatInputModule,
        MatDialogModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDatetimeModule,
        MatDatetimepickerModule,
        MatRadioModule,
        MatButtonModule,
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
            animationDuration: 600,
            showTitle:false,
            showUnits:false,
            showSubtitle:false
            
          }),
        
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        DashboardComponent,
        PlaygameComponent,
        GameHistoryComponent ,
        StartGameComponent ,
        AdminUserComponent ,
        TournamentAddComponent ,
        TournamentListComponent,
        HowToPlayComponent ,
        AboutUsComponent ,
        TournamentsListAdminComponent ,
        TournamentsEditAdminComponent,
        MytournamentsComponent,
        MyTournamentDetailsComponent     ],
    providers: [ ],
    bootstrap: [AppComponent]
})
export class AppModule { };