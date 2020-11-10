import { Component, HostListener, ElementRef, OnInit} from '@angular/core';
import {formatDate } from '@angular/common';
import { AccountService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    showMyContainer = false;
    isAdmin =false;
    user: any;
    date:Date;
    today= new Date();
    jstoday = '';
    sec:any;
    constructor(private accountService: AccountService,  private elementRef:ElementRef) {
        this.showMyContainer = false;
        setInterval(() => {
            this.date = new Date()
          //  console.log('date',this.date)
        }, 1000)
        this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss', 'en-US');
       
    }
    ngOnInit() {
        this.accountService.user.subscribe(x => this.user = x);
        this.user = this.accountService.userValue;
        if(this.user){
            this.isAdmin = this.user.isAdmin;
        }else{
            this.isAdmin = false;
        }
        console.log('user-app',this.isAdmin)
    }
    ngOnDestroy() {
     
      }
    @HostListener('document:click', ['$event'])
    documentClick(event: any) {
        this.accountService.user.subscribe(x => this.user = x);
        this.user = this.accountService.userValue;
        if(this.user){
            this.isAdmin = this.user.isAdmin;
        }else{
            this.isAdmin = false;
        }
        console.log('event',this.showMyContainer)
        if(this.showMyContainer){
           // this.showMyContainer = !this.showMyContainer;
        }

    }
    togglemenu() {
       this.showMyContainer = !this.showMyContainer;
    }
    logout() {
        this.accountService.logout();
    }
}