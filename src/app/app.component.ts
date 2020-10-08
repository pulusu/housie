import { Component } from '@angular/core';
import {formatDate } from '@angular/common';
import { AccountService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    user: User;
    date:Date;
    today= new Date();
    jstoday = '';
    sec:any;
    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
        setInterval(() => {
            this.date = new Date()
          //  console.log('date',this.date)
        }, 1000)
        this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss', 'en-US');
        var res= this.jstoday.slice(-2); 
        if(res > '30'){
            this.sec = +res-30;
            console.log('g', res)
        }else{
            this.sec = res;
            console.log('l', res)
        }
        console.log('less', this.sec);
        var p = ((this.sec/30)*100).toFixed(2)
        console.log('p',p)

    }

    logout() {
        this.accountService.logout();
    }
}