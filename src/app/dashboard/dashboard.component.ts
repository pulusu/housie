import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  users = null;
  user:any;
  orderedcheck=false;
  constructor(private accountService: AccountService) {
    this.user = this.accountService.userValue;
    console.log('user',this.user.id)
  }

  ngOnInit() {
      this.accountService.tournamentsAll()
          .pipe(first())
          .subscribe((datasubmit:any)=>{
              this.users = datasubmit.tournaments
              console.log('datasubmit',datasubmit.tournaments)
              }, (err) => {
                console.log(err);
              });
  }
  joibGame(event, tourny:any) {
    console.log('tourny',tourny)
    
    var obj = {};  
    obj['idcustomer']=this.user.id;
    obj['idtournament']=tourny._id;
    obj['numberoftickets']=1;
    obj['amount']=tourny.ticketprice;
    console.log('obj',obj)
    this.accountService.joinTorney(obj)
          .pipe(first())
          .subscribe((datasubmit:any)=>{
                     console.log('join',datasubmit)
              }, (err) => {
                console.log(err);
              });
}
checkIfExists(id){
 this.orderedcheck = true;
}
  
}