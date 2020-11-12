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
        //this.logout();
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('housieuserdetails')));
        this.user =  this.userSubject.asObservable();
    }

    public get userValue(): User {
       // this.logout();
        return JSON.parse(localStorage.getItem('housieuserdetails'));
    }

    login(mobile, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { mobile, password })
            .pipe(map((user:any) => {
                if(user.error==false){
                    if(user.response.user_type==0){
                        user.response.isAdmin = true; 
                    }else{
                        user.response.isAdmin = false; 
                    }
                    localStorage.setItem('housieuserdetails', JSON.stringify(user.response));
                    
                    this.userSubject.next(user.response);
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
    CreateUser(params) {
        var formData = new FormData();
        formData.append('profileimage', params.profileimage);
        formData.append('address', params.address);
        formData.append('city', params.city);
        formData.append('country', params.country);
        formData.append('displayname', params.displayname);
        formData.append('dob', params.dob);
        formData.append('email', params.email);
        formData.append('mobile', params.mobile);
        formData.append('name', params.name);
        formData.append('password', params.password);
        formData.append('pincode', params.pincode);
        formData.append('state', params.state);
     
     formData.forEach((value, key) => {
        console.log(key + " " + value)
      });

     
        return this.http.post(`${environment.apiUrl}/users/create-user`, formData);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }
    howToPlay() {
        return this.http.get<any>(`${environment.apiUrl}/pages/how-to-play`);
    }
    AboutUs() {
        return this.http.get<any>(`${environment.apiUrl}/pages/about-us`);
    }
    tournamentsAll() {
        return this.http.get<any>(`${environment.apiUrl}/tournaments/getAllAdmin`);
    }
    tournamentsAllbyCustomer(params) {
        return this.http.post<any>(`${environment.apiUrl}/tournaments/getAllbyId`,params);
    }
    tournamentsCreate(params:any) {
        return this.http.post<any>(`${environment.apiUrl}/tournaments/create`,params);
    }
    otp(user: User) {
        return this.http.post(`${environment.apiUrl}/users/sendOTPregister`, user);
    }
    ForgotPassword(params: any) {
        return this.http.post(`${environment.apiUrl}/users/forgot-password`, params);
    }
    VerifyOtp(params: any) {
        console.log('paramsparams',params)
        return this.http.post(`${environment.apiUrl}/users/verifyotp`, params);
    }
    changePassword(params: any) {
        return this.http.put(`${environment.apiUrl}/users/change-password`, params);
    }
    tourneysHistoryByUser(params) {
        return this.http.post<any>(`${environment.apiUrl}/orders/tourneysHistoryByUser`,params);
    }
    tourneyHistoryByTourneyId(params) {
        return this.http.post<any>(`${environment.apiUrl}/orders/tourneyHistoryByTourneyId`,params);
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
    TornamentgetById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/tournaments/${id}`);
    }
    Tornamentupdate(id, params) {
        return this.http.put(`${environment.apiUrl}/tournaments/${id}`, params)
            .pipe(map(x => {
               return x;
            }));
    }
    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, params) {
        var formData = new FormData();
        formData.append('profileimage', params.profileimage);
        formData.append('id', params.id);
        formData.append('address', params.address);
        formData.append('city', params.city);
        formData.append('country', params.country);
        formData.append('displayname', params.displayname);
        formData.append('dob', params.dob);
        formData.append('email', params.email);
        formData.append('mobile', params.mobile);
        formData.append('name', params.name);
        formData.append('password', params.password);
        formData.append('pincode', params.pincode);
        formData.append('state', params.state);
     
     formData.forEach((value, key) => {
        console.log(key + " " + value)
      });

     
        return this.http.put(`${environment.apiUrl}/users/update-profile`, formData)
            .pipe(map(x => {
                console.log('x',x)
                console.log('params',formData)
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                   // localStorage.setItem('housieuserdetails', JSON.stringify(user.response));

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