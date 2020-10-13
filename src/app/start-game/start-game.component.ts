import { Component, OnInit, ElementRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService ,AlertService} from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.less']
})
export class StartGameComponent implements OnInit {
  users = null;
  user:any;
  tournamentDetails:any;
  paramsid:any;
  tname:any;
  seconds:any;
  mytickets:any;
  remaintime:any;
  alltikets:any;
  allcolumnres:any;
  timerInterval:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private elementRef:ElementRef,
    private toastr: ToastrService

    ) {
    this.user = this.accountService.userValue;
    console.log('user',this.user.id)
  }

  ngOnInit(): void {
    this.paramsid = this.route.snapshot.params['id'];
    var obj = {};  
    obj['idcustomer']=this.user.id;
    obj['idtournament']=this.paramsid;
    

    //console.log('obj-params',obj)

      this.accountService.mytickets(obj)
          .pipe(first())
          .subscribe((mytickets:any)=>{
            console.log('mytickets',mytickets)
          this.tournamentDetails = mytickets.response[0].tournament[0];
          var ticketsCount = mytickets.response[0].tickets.length;
          this.tname=this.tournamentDetails.name;
          this.seconds=this.tournamentDetails.seconds;
          var randmNumbers =this.tournamentDetails.randomnumbers;
          this.mytickets=mytickets.response[0].tickets;
          var alltikets = new Array();
          for (let j = 0; j < ticketsCount; j++) {
            var numbers = new Array(); 
            for (let i = 1; i < 28; i++) {
               numbers.push(this.mytickets[j]['column'+i]);
            }
            alltikets.push(numbers);
          }
          var allcolumnres = new Array();
          for (let k = 0; k < ticketsCount; k++) {
            var columnres = new Array(); 
            for (let c = 1; c < 28; c++) {
              columnres.push(this.mytickets[k]['columnres'+c]);
            }
            allcolumnres.push(columnres);
          }
          this.allcolumnres = allcolumnres;
          this.alltikets=alltikets;
          var startDate = new Date(this.tournamentDetails.startdate); 
          var now = new Date()
          var diffMs = (+startDate - +now) / 1000; 
          this.remaintime=diffMs;
          this.timerInterval = setInterval(() => {
            var now = new Date()
            var diffMs = (+startDate - +now) / 1000; 
            if(diffMs<0){
              this.router.navigate(['/play-game/'+this.paramsid]);	 

            }
          }, 1000)

        }, (err) => {
                console.log(err);
              });

  }
  ngOnDestroy() {
    clearInterval(this.timerInterval);
 }

}
