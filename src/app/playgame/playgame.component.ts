import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService ,AlertService} from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-playgame',
  templateUrl: './playgame.component.html',
  styleUrls: ['./playgame.component.less']
})
export class PlaygameComponent implements OnInit {
  users = null;
  user:any;
  mytickets:any;
  numberss:any;
  paramsid: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  tournamentDetails:any;
  tname:any;
  seconds:any;
  randmNumbers:any;
  currentNumber:any;
  tp:any;
  rn:any;
  lastfive:any;
  allnumbers:any;


    private _trialEndsAt;
    private _diff: number;
    private _days: number;
    private _hours: number;
    private _minutes: number;
    private _seconds: number;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService

    ) {
    this.user = this.accountService.userValue;
    console.log('user',this.user.id)
  }

  ngOnInit() {
    this.tp=0;
    this.paramsid = this.route.snapshot.params['id'];
    var obj = {};  
    obj['idcustomer']=this.user.id;
    obj['idtournament']=this.paramsid;
    //console.log('obj-params',obj)

      this.accountService.mytickets(obj)
          .pipe(first())
          .subscribe((mytickets:any)=>{

          var startDate = new Date("2020-10-02T13:17:00.000Z");
          var now = new Date()
          
          console.log('startDate',startDate)
          console.log('now',now)
          var distance = +startDate - +now;
          if (distance < 0) {
            console.log('less',distance)
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            console.log('lessseconds',seconds)

          }else{
            
            setInterval(() => {
              
              this.calculateDiff(startDate);
              }, 100);            
          }
          this.tournamentDetails = mytickets.response[0].tournament[0];
          var ticketsCount = mytickets.response[0].tickets.length;
          this.tname=this.tournamentDetails.name;
          this.seconds=this.tournamentDetails.seconds;
          var randmNumbers =this.tournamentDetails.randomnumbers;
          this.randmNumbers =  randmNumbers.split(",");
          this.mytickets=mytickets.response[0].tickets;
          var alltikets = new Array();
          for (let j = 0; j < ticketsCount; j++) {
            var numbers = new Array(); 
            for (let i = 1; i < 28; i++) {
               numbers.push(this.mytickets[j]['column'+i]);
            }
            alltikets.push(numbers);

          }
          this.numberss=alltikets;
          this.rn=0;
          var allnumbers = new Array();
          this.currentNumber=this.randmNumbers[this.rn];
          allnumbers.push(this.randmNumbers[this.rn])
          this.lastfive = allnumbers.slice(Math.max(allnumbers.length - 5, 0));

          setInterval(() => {
            this.tp=0;
            this.rn=this.rn+1;
            allnumbers.push(this.randmNumbers[this.rn])
            this.currentNumber=this.randmNumbers[this.rn];
            this.allnumbers=JSON.parse(JSON.stringify(allnumbers));
            this.lastfive = allnumbers.slice(Math.max(allnumbers.length - 5, 0));

          }, 30000);
          //  console.log('this.randmNumbers[this.rn]',this.randmNumbers[this.rn]);
          setInterval(() => {
            this.tp=this.tp + 0.333333333333;
            if(this.tp>=100){
              this.tp=0;
            } 
          //  console.log('this.tp',this.tp)
            }, 100);

          
          
          }, (err) => {
                console.log(err);
              });

  }
calculateDiff(startDate){
  var now = new Date().getTime();
  var distance = +startDate - +now;
  if (distance < 0) {
    window.location.reload();
    console.log('less',distance)
  }else{
    var b = new Date();
    var difference = (+b - +startDate) / 1000;    
    console.log('distance-difference', distance);
  }
}


  
}