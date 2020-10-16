import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlaygameComponent } from './playgame/playgame.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { StartGameComponent } from './start-game/start-game.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { TournamentAddComponent } from './tournament-add/tournament-add.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { AboutUsComponent } from './about-us/about-us.component';


const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);

const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'play-game/:id', component: PlaygameComponent, canActivate: [AuthGuard] },
    { path: 'start-game/:id', component: StartGameComponent, canActivate: [AuthGuard] },
    { path: 'game-history/:id', component: GameHistoryComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
	
    { path: 'account', loadChildren: accountModule },
	{ path: 'admin-user', component: AdminUserComponent, canActivate: [AuthGuard] },
	{ path: 'tournament-add', component: TournamentAddComponent, canActivate: [AuthGuard] },
	{ path: 'how-to-play', component: HowToPlayComponent, canActivate: [AuthGuard] },
	{ path: 'about-us', component: AboutUsComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }