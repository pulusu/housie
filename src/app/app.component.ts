import { Component, HostListener, ElementRef, OnInit} from '@angular/core';
import {formatDate } from '@angular/common';
import { AccountService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    showMyContainer = false;
    user: User;
    date:Date;
    today= new Date();
    jstoday = '';
    sec:any;
    constructor(private accountService: AccountService,  private elementRef:ElementRef) {
        this.showMyContainer = false;
        this.accountService.user.subscribe(x => this.user = x);
        this.user = this.accountService.userValue;
    console.log('user',this.user)
        setInterval(() => {
            this.date = new Date()
          //  console.log('date',this.date)
        }, 1000)
        this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss', 'en-US');
        var res= this.jstoday.slice(-2); 
        if(res > '30'){
            this.sec = +res-30;
        }else{
            this.sec = res;
        }
       // console.log('less', this.sec);
        var p = ((this.sec/30)*100).toFixed(2)
        //console.log('p',p)

    }
    @HostListener('document:click', ['$event'])
    documentClick(event: MouseEvent) {
        if(event['path'][1]['className'] != 'menu-click'){ 
            this.showMyContainer = false; 
        }
             

    }
    togglemenu() {
        console.log('ssss')
        this.showMyContainer = !this.showMyContainer;

    }
    logout() {
        this.accountService.logout();
    }
}