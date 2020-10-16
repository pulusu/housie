import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
       ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('housieuserdetails')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return JSON.parse(localStorage.getItem('housieuserdetails'));
    }

    login(mobile, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { mobile, password })
            .pipe(map((user:any) => {
                console.log(user.error);
                if(user.error==false){
                    localStorage.setItem('housieuserdetails', JSON.stringify(user.response));
                    this.userSubject.next(user);
                    return user;
                }else{
                    return user;
                }
            }));
    }

    

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('housieuserdetails');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    tournamentsAll() {
        return this.http.get<any>(`${environment.apiUrl}/tournaments/all`);
    }
    tournamentsAllbyCustomer(params) {
        return this.http.post<any>(`${environment.apiUrl}/tournaments/getAllbyId`,params);
    }
	otp(user: User) {
        return this.http.post(`${environment.apiUrl}/users/sendOTPregister`, user);
    }
    wineersListbyTourney(params) {
        return this.http.post<any>(`${environment.apiUrl}/winners/winnersbyTournament`,params);
    }
    winnerCreate(params) {
        return this.http.post<any>(`${environment.apiUrl}/winners/create`,params);
    }
    joinTorney(params) {
        return this.http.post(`${environment.apiUrl}/orders/create`, params);
    }
    mytickets(params) {
        return this.http.post(`${environment.apiUrl}/orders/mytickets`, params);
    }
    updateTicketNumber(params){
        return this.http.put(`${environment.apiUrl}/tickets/updateTicket`, params);
    }
    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('housieuserdetails', JSON.stringify(user.response));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
}