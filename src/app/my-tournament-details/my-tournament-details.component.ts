import { Component, OnInit, ElementRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService ,AlertService} from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-tournament-details',
  templateUrl: './my-tournament-details.component.html',
  styleUrls: ['./my-tournament-details.component.less']
})
export class MyTournamentDetailsComponent implements OnInit {

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
  startdate:any;

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

      this.accountService.tourneyHistoryByTourneyId(obj)
          .pipe(first())
          .subscribe((mytickets:any)=>{
          
          this.tournamentDetails = mytickets.response[0].tournament[0];
          var ticketsCount = mytickets.response[0].tickets.length;
          this.tname=this.tournamentDetails.name;
          this.seconds=this.tournamentDetails.seconds;
          this.startdate=this.tournamentDetails.startdate;
          this.mytickets=mytickets.response[0].tickets;
          console.log('mytickets',this.mytickets[0].prizes)
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
          
         

        }, (err) => {
                console.log(err);
              });

  }
  ngOnDestroy() {
    //clearInterval(this.timerInterval);
 }

}

