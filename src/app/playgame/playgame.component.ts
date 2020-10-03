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
  remaintime:any;
  mytickets:any;
  alltikets:any;
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
  classstatus: boolean = false;

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
            //alltikets.push({_id: 2});

          }
          this.alltikets=alltikets;
          console.log('this.tournamentDetails',this.alltikets)

          var startDate = new Date('2020-10-03 20:29:00');
          var now = new Date()
          var distance = +startDate - +now;
          this.reamingTime(startDate)
          if (distance <= 0) {
            setInterval(() => {
              this.reamingTime(startDate)
              }, 10000);     
        
          }else{
            setInterval(() => {
              this.calculateDiff(startDate);
              }, 100);            
          }

          
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

reamingTime(Christmas){
  var now = new Date()
  var diffMs = (+now - +Christmas) / 1000; // milliseconds between now & Christmas
  this.remaintime = 2700 - +diffMs;
  var totalofmin = diffMs/30
  if(this.remaintime<0){
    alert('Game Completed')
  }
  console.log('remaintime',this.remaintime)
  console.log('totalofmin',totalofmin)
  var allnumbers = new Array();
  for(let i=0; i<totalofmin; i++){
    allnumbers.push(this.randmNumbers[i])
    this.currentNumber=this.randmNumbers[i];
    this.allnumbers=JSON.parse(JSON.stringify(allnumbers));
    this.lastfive = allnumbers.slice(Math.max(allnumbers.length - 5, 0));
  }
}
clickedvalue(val:any,row:number,cellno:number,ticketid:string){
console.log('val',val);
console.log('row',row);
console.log('cel',cellno);
console.log('ticketid',ticketid)
console.log('swww',this.isDonenumber(val))
if(this.isDonenumber(val))
this.classstatus = !this.classstatus;       

}

isDonenumber(val:number){
  var allnumbers = this.allnumbers;
  for (let index = 0; index < allnumbers.length; index++) {
    if (allnumbers[index] == val) {
      return true
    }
}

}

  
}