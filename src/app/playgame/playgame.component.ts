import { Component, OnInit, ElementRef } from '@angular/core';
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
  selectedItem:any;
  allcolumnres:any;
  selectobj = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private elementRef:ElementRef

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
          this.tournamentDetails = mytickets.response[1].tournament[0];
          var ticketsCount = mytickets.response[1].tickets.length;
          this.tname=this.tournamentDetails.name;
          this.seconds=this.tournamentDetails.seconds;
          var randmNumbers =this.tournamentDetails.randomnumbers;
          this.randmNumbers =  randmNumbers.split(",");
          this.mytickets=mytickets.response[1].tickets;
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
          var startDate = new Date('2020-10-05 12:45:00');
          var now = new Date()
          var distance = +startDate - +now;
          this.reamingTime(startDate)
          if (distance <= 0) {
            setInterval(() => {
              this.reamingTime(startDate)
              }, 100);     
        
          }else{
            setInterval(() => {
              this.calculateDiff(startDate);
              }, 100);            
          }
          setInterval(() => {
            this.tp=this.tp + 0.333333333333;
            if(this.tp>=100){
              this.tp=0;
            } 
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
  }else{
    var b = new Date();
    var difference = (+b - +startDate) / 1000;    
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
  var allnumbers = new Array();
  for(let i=0; i<totalofmin; i++){
    allnumbers.push(this.randmNumbers[i])
    this.currentNumber=this.randmNumbers[i];
    this.allnumbers=JSON.parse(JSON.stringify(allnumbers));
    this.lastfive = allnumbers.slice(Math.max(allnumbers.length - 5, 0));
  }
}
clickedvalue(event,val:number,row:number,cellno:number,ticketid:string){

if(this.isDonenumber(val)){
  var obj = {};  
  obj['id']=ticketid;
  obj['columnres'+cellno]=val;
 
this.upateTicket(obj)
this.selectobj[cellno+'_'+ticketid] = 'active';
event.srcElement.classList.add('sel_active');

}

}

isDonenumber(val:number){
  var allnumbers = this.allnumbers;
  for (let index = 0; index < allnumbers.length; index++) {
    if (allnumbers[index] == val) {
      return true
    }
}

}
upateTicket(obj) {
  this.accountService.updateTicketNumber(obj)
        .pipe(first())
        .subscribe((dataresponse:any)=>{
          console.log('dataresponse',dataresponse)
            }, (err) => {
              console.log(err);
            });
}
getcount(ticketId,gametype){
console.log(ticketId,gametype)
var clss = this.elementRef.nativeElement.querySelectorAll('.sel_active');
var ssssssss =gametype+'_'+ticketId;
  var count=0;
for(let r=0; r<clss.length; r++){
  if(clss[r].classList[0]==ssssssss){
    count++;
  }
}
console.log(count)
if(gametype==0 && count>=5){
  this.firstSecondThirdRow(ticketId,clss);
}else if(gametype==1){
  this.firstSecondThirdRow(ticketId,gametype);
}else if(gametype==2){
  this.firstSecondThirdRow(ticketId,clss);
}else if(gametype==3){
  this.fastfive(ticketId,clss);
}else if(gametype==4){
  //this.fullhouise(ticketId,clss);
}

}
fastfive(ticketId,clss){
  //console.log('clss-fast-five',clss)
}
firstSecondThirdRow(ticketId,gametype){
  console.log(gametype,ticketId)
}

fullhouise(ticketId,clss){
  //console.log('clss-fullhousie',clss)
}

  
}