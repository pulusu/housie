import { Component, OnInit, ElementRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService ,AlertService} from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {formatDate } from '@angular/common';



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
  gamestart =true;
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
  wineersList:any;
  fastFivewinner:any;
  fourCornerswinner:any;
  fullHousiewinner:any;
  thirdRowwinner:any;
  secondRowwinner:any;
  firstRowwinner:any;
  selectobj = {};
  date:Date;
  today= new Date();
  jstoday = '';

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

  ngOnInit() {
    this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss', 'en-US');
    var res= this.jstoday.slice(-2); 
    if(res > '30'){
        this.tp = +res-30;
        console.log('g', res)
    }else{
        this.tp = res;
        console.log('l', res)
    }
    console.log('less', this.tp);
    var p = ((this.tp/30)*100).toFixed(4)
    console.log('p',p)
    
    this.tp = parseFloat(p);
    this.paramsid = this.route.snapshot.params['id'];
    var obj = {};  
    obj['idcustomer']=this.user.id;
    obj['idtournament']=this.paramsid;
    this.wineersListbyTourney(obj)
    
    setInterval(() => {
      this.wineersListbyTourney(obj)
    }, 500);   

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
          var startDate = new Date('2020-10-08 11:35:00'); 
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
            console.log('this.tp',this.tp)
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
  }
}

reamingTime(Christmas){
  var now = new Date()
  var diffMs = (+now - +Christmas) / 1000; // milliseconds between now & Christmas
  if(diffMs<0){
    this.gamestart =false;
  }
  this.remaintime = 2700 - +diffMs;
  var totalofmin = diffMs/30
  if(this.remaintime<0){
    let title ='';
    let desc = 'Game Completed';
    this.tossterwarning(title,desc)
    setTimeout(()=>{
      this.router.navigate(['/game-history/'+this.paramsid]);	 
      },1000); 
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
console.log('clss',clss)
var game123 =gametype+'_'+ticketId;

var count=0;
for(let r=0; r<clss.length; r++){
  if(clss[r].classList[0]===game123){
    count++;
  }
}
console.log(count)
if(gametype==0){
  if(count>=5){
    var objwinner = {};
    objwinner['idprizetype']=gametype;
    objwinner['idticket']=ticketId;
    objwinner['idtournament']=this.paramsid;
    objwinner['idcustomer']=this.user.id;
    this.firstSecondThirdRow(objwinner);
  }else{
    let title ='';
    let desc = 'Must be select 5 numers in 1st row';
    this.tossterwarning(title,desc)
  }

}else if(gametype==1){
  if(count>=5){
    var objwinner = {};
    objwinner['idprizetype']=gametype;
    objwinner['idticket']=ticketId;
    objwinner['idtournament']=this.paramsid;
    objwinner['idcustomer']=this.user.id;
    this.firstSecondThirdRow(objwinner);
  }else{
    let title ='';
    let desc = 'Must be select 5 numers in 2nd row';
    this.tossterwarning(title,desc)
  }
}else if(gametype==2){
  if(count>=5){
    var objwinner = {};
    objwinner['idprizetype']=gametype;
    objwinner['idticket']=ticketId;
    objwinner['idtournament']=this.paramsid;
    objwinner['idcustomer']=this.user.id;
    this.firstSecondThirdRow(objwinner);
  }else{
    let title ='';
    let desc = 'Must be select 5 numers in 3rd row';
    this.tossterwarning(title,desc)
  }
}else if(gametype==3){
  
  this.fastfive(ticketId,clss)
  
}else if(gametype==5){
  this.fullhouise(ticketId,clss)
}

}
fastfive(ticketId,clss){
var count=0;
var game1 =0+'_'+ticketId;
var game2 =1+'_'+ticketId;
var game3 =2+'_'+ticketId;

  for(let r=0; r<clss.length; r++){
   if(clss[r].classList[0]===game1 || clss[r].classList[0]===game2 || clss[r].classList[0]===game3){
    count++;
    console.log('fast',count)
  }
  }
  if(count>=5){
    var objwinner = {};
    objwinner['idprizetype']=3;
    objwinner['idticket']=ticketId;
    objwinner['idtournament']=this.paramsid;
    objwinner['idcustomer']=this.user.id;
    this.firstSecondThirdRow(objwinner);
  }else{
    let title ='';
    let desc = 'Must be select 5 numers';
    this.tossterwarning(title,desc)
  }
}
firstSecondThirdRow(objwinner){
  this.accountService.winnerCreate(objwinner)
        .pipe(first())
        .subscribe((winnerCreate:any)=>{
          console.log('winnerCreate',winnerCreate)
          if(winnerCreate.error==false){
            if(winnerCreate.userdetails.idprizetype == 0){
              let title ='Congratulations';
              let desc = 'You won 1st row with rank '+ winnerCreate.userdetails.rank +'';
              this.tosstersuccess(title,desc)
            }else if(winnerCreate.userdetails.idprizetype == 1){
              let title ='Congratulations';
              let desc = 'You won 2nd row with rank '+ winnerCreate.userdetails.rank +'';
              this.tosstersuccess(title,desc)
            }else if(winnerCreate.userdetails.idprizetype == 2){
              let title ='Congratulations';
              let desc = 'You won 3rd row with rank '+ winnerCreate.userdetails.rank +'';
              this.tosstersuccess(title,desc)
            }else if(winnerCreate.userdetails.idprizetype == 3){
              let title ='Congratulations';
              let desc = 'You won Fast Five with rank '+ winnerCreate.userdetails.rank +'';
              this.tosstersuccess(title,desc)
            }else if(winnerCreate.userdetails.idprizetype == 5){
              let title ='Congratulations';
              let desc = 'You won Housie with rank'+ winnerCreate.userdetails.rank +'';
              this.tosstersuccess(title,desc)
            }else if(winnerCreate.userdetails.idprizetype == 4){
              let title ='Congratulations';
              let desc = 'You won Four corners with rank '+ winnerCreate.userdetails.rank +'';
              this.tosstersuccess(title,desc)
            }

          }
      
            }, (err) => {
              console.log(err);
            });  
}

fullhouise(ticketId,clss){
  var count=0;
  var game1 =0+'_'+ticketId;
  var game2 =1+'_'+ticketId;
  var game3 =2+'_'+ticketId;
  
    for(let r=0; r<clss.length; r++){
     if(clss[r].classList[0]===game1 || clss[r].classList[0]===game2 || clss[r].classList[0]===game3){
      count++;
      console.log('fast',count)
     }
    }
    if(count>=15){
      var objwinner = {};
      objwinner['idprizetype']=5;
      objwinner['idticket']=ticketId;
      objwinner['idtournament']=this.paramsid;
      objwinner['idcustomer']=this.user.id;
      this.firstSecondThirdRow(objwinner);
    }else{
      let title ='';
      let desc = 'Must be select all numers';
      this.tossterwarning(title,desc)
    }
  
}

wineersListbyTourney(objwinner){
  this.accountService.wineersListbyTourney(objwinner)
        .pipe(first())
        .subscribe((wineersListbyTourney:any)=>{
            this.wineersList = wineersListbyTourney.winners;
            this.fastFivewinner = wineersListbyTourney.winners.fastFive;
            this.firstRowwinner = wineersListbyTourney.winners.firstRow;
            this.secondRowwinner = wineersListbyTourney.winners.secondRow;
            this.thirdRowwinner = wineersListbyTourney.winners.thirdRow;
            this.fullHousiewinner = wineersListbyTourney.winners.fullHousie;
            this.fourCornerswinner = wineersListbyTourney.winners.fourCorners;
            }, (err) => {
              console.log(err);
            });  
}
tossterwarning(title,desc){
  this.toastr.warning(desc, title);
}
tosstererror(title,desc){
  this.toastr.error(desc, title);
}
tosstersuccess(title,desc){
  this.toastr.success(desc, title);
}
tossterinfo(title,desc){
  this.toastr.info(desc, title);
}


}