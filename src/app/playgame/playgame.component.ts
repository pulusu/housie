import { Component, OnInit, ElementRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService ,AlertService} from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {formatDate } from '@angular/common';
import Speech from "speak-tts";


@Component({
  selector: 'app-playgame',
  templateUrl: './playgame.component.html',
  styleUrls: ['./playgame.component.less'],
  host: {
  "(window:resize)":"onWindowResize($event)"
  }
})
export class PlaygameComponent implements OnInit {
  users = null;
  isMobile: boolean = false;
  width:number = window.innerWidth;
  height:number = window.innerHeight;
  mobileWidth:number  = 760;
  showMyContainer = false;
  showMyContainermobile=false;
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
  fastfivewinners:any;
  firstrowwinners:any;
  secondrowwinners:any;
  thirdrowwinners:any;
  fourcornerswinners:any;
  fullhousewinners:any;
  timer = null;
  timerwinner = null;
  outofffaastfive:any;
  outofffirstRow:any;
  outoffsecondRow:any;
  outoffthirdRow:any;
  outofffullHousie:any;
  fourcornersNum:any;
  outofffourCorners:any;
  claim_status_fastFive:boolean;
  duration :any;
  perNumber :any;

  html = "";
  result = "";
  speech: any;
  speechData: any;
  setVoice: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private elementRef:ElementRef,
    private toastr: ToastrService

    ) {
    this.user = this.accountService.userValue;
    this.speech = new Speech(); 
    if (this.speech.hasBrowserSupport()) {
      // returns a boolean
      console.log("speech synthesis supported");
      this.speech
        .init({
          volume: 1,
          lang: "hi-IN",
          rate: 1,
          pitch: 1,
          voice: "Google US English",
          splitSentences: true,
          listeners: {
            onvoiceschanged: voices => {
              console.log("Event voiceschanged", voices);
            }
          }
        })
        .then(data => {
          this.speechData = data;
          data.voices.forEach(voice => {
            console.log(voice.name + " " + voice.lang);
          });
        })
        .catch(e => {
          console.error("An error occured while initializing : ", e);
        });
    }
  }

  ngOnInit() {
    this.claim_status_fastFive=true;
    this.isMobile = this.mobileWidth < this.width;
    this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss', 'en-US');
    var res= this.jstoday.slice(-2); 
    this.duration = 2700;
    this.perNumber = (this.duration) / 90;
    console.log('perNumberperNumber',res)
    if(res >= this.perNumber){
        this.tp = +res-this.perNumber;
    }else{
        this.tp = res;
    }
    
    var p = ((this.tp/this.perNumber)*100).toFixed(3)
    this.tp = parseFloat(p);
    console.log('p',p)
    this.paramsid = this.route.snapshot.params['id'];
    var obj = {};  
    obj['idcustomer']=this.user.id;
    obj['idtournament']=this.paramsid;
    this.wineersListbyTourney(obj)
    this.CompareFourCorner()
    this.timerwinner = setInterval(() => {
      this.wineersListbyTourney(obj)
    }, 100);   

    //console.log('obj-params',obj)

      this.accountService.mytickets(obj)
          .pipe(first())
          .subscribe((mytickets:any)=>{
            if(mytickets.response.length==0){
              let title ='';
              let desc = 'You don"t have tickets';
              this.tossterwarning(title,desc)
               setTimeout(()=>{
                this.router.navigate(['/dashboard/']);	 
                },1000); 

            }
          
          this.tournamentDetails = mytickets.response[0].tournament[0];
          var ticketsCount = mytickets.response[0].tickets.length;
          this.tname=this.tournamentDetails.name;
          this.seconds=this.tournamentDetails.seconds;
          this.fastfivewinners=this.tournamentDetails.fastfivewinners;
          this.firstrowwinners=this.tournamentDetails.firstrowwinners;
          this.secondrowwinners=this.tournamentDetails.secondrowwinners;
          this.thirdrowwinners=this.tournamentDetails.thirdrowwinners;
          this.fullhousewinners=this.tournamentDetails.fullhousewinners;
          this.fourcornerswinners=this.tournamentDetails.fourcornerswinners;
          var randmNumbers =this.tournamentDetails.randomnumbers;
          this.randmNumbers =  randmNumbers.split(",");
          this.mytickets=mytickets.response[0].tickets;
          var alltikets = new Array();
          var alltiketsFirstRow = new Array();
         
          for (let j = 0; j < ticketsCount; j++) {
            var numbers = new Array(); 
            for (let i = 1; i < 28; i++) {
               numbers.push(this.mytickets[j]['column'+i]);
            }
            alltikets.push(numbers);
            let frow= alltikets[j].slice(0, 9);
            let srow= alltikets[j].slice(18, 27);
            let firstrow = this.removeElementsWithValue(frow, 0);
            let secondrow = this.removeElementsWithValue(srow, 0);
            let f_one = firstrow[0]
            let f_last = firstrow[firstrow.length - 1]
            let t_one = secondrow[0]
            let t_last = secondrow[secondrow.length - 1]
            let fruits = []
            fruits.push(f_one, f_last, t_one, t_last)
            let ticketid = this.mytickets[j]._id
            alltiketsFirstRow[ticketid]=fruits;
          }
          
          this.fourcornersNum = alltiketsFirstRow;
          

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
          
          this.reamingTime(startDate,this.duration,this.perNumber)

              this.timer = setInterval(() => {
              this.reamingTime(startDate,this.duration,this.perNumber)
              let minper =60/this.perNumber;
                          this.tp=this.tp + minper;
                          if(this.tp>=100){
                            this.tp=this.tp-99.95;
                          } 
                          console.log('this.tp',this.tp)
                           
              }, 600);
                      
    
          }, (err) => {
                console.log(err);
              });

     
             this.setVoice = setInterval(() => {
                this.start()
               }, 15000);  
                        
  }

reamingTime(Christmas,duration,perNumber){
  var now = new Date()
  var diffMs = (+now - +Christmas) / 1000; // milliseconds between now & Christmas
  if(diffMs<0){
       this.router.navigate(['/start-game/'+this.paramsid]);	 
  }
 
  this.remaintime = duration - +diffMs;
  var totalofmin = diffMs/perNumber
  if(this.remaintime<0){
    let title ='';
    let desc = 'Game Completed';
    this.tossterwarning(title,desc)
    if (this.timer) {
      clearInterval(this.timer);
    }
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
  
 // console.log('allnumbers',allnumbers)


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
//          console.log('dataresponse',dataresponse)
            }, (err) => {
              console.log(err);
            });
}
getcount(event,ticketId,gametype){
  
//console.log(ticketId,gametype)
var clss = this.elementRef.nativeElement.querySelectorAll('.sel_active');
var game123 =gametype+'_'+ticketId;
var game0 =0+'_'+ticketId;
var game1 =1+'_'+ticketId;
var game2 =2+'_'+ticketId;

var count=0;
for(let r=0; r<clss.length; r++){
  if(clss[r].classList[0]===game123){
        count++;
  }
  
    
  
  
}
if(gametype==0){
  if(count>=5){

    var objwinner = {};
    objwinner['idprizetype']=gametype;
    objwinner['idticket']=ticketId;
    objwinner['idtournament']=this.paramsid;
    objwinner['idcustomer']=this.user.id;
  
    if((this.firstrowwinners <= this.firstRowwinner.length)){
      let title ='';
      let desc = 'First Row alreday completed';
      this.tossterwarning(title,desc) 
    }else{
        this.firstSecondThirdRow(objwinner);
        event.srcElement.classList.add('selected');
    }

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
    if((this.secondrowwinners <= this.secondRowwinner.length)){
      let title ='';
      let desc = 'Second Row alreday completed';
      this.tossterwarning(title,desc) 
    }else{
        this.firstSecondThirdRow(objwinner);
        event.srcElement.classList.add('selected');
      }
    

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
    if((this.thirdrowwinners <= this.thirdRowwinner.length)){
      let title ='';
      let desc = 'Third Row alreday completed';
      this.tossterwarning(title,desc) 
    }else{
      this.firstSecondThirdRow(objwinner);
      event.srcElement.classList.add('selected');
    }
  }else{
    let title ='';
    let desc = 'Must be select 5 numers in 3rd row';
    this.tossterwarning(title,desc)
  }
}else if(gametype==3){
  
  this.fastfive(event,ticketId,clss)

  
}else if(gametype==5){
  this.fullhouise(event,ticketId,clss)
}else if(gametype==4){
  this.fourCorners(event,ticketId,clss)
}

}
fastfive(event,ticketId,clss){
var count=0;
var game1 =0+'_'+ticketId;
var game2 =1+'_'+ticketId;
var game3 =2+'_'+ticketId;

  for(let r=0; r<clss.length; r++){
   if(clss[r].classList[0]===game1 || clss[r].classList[0]===game2 || clss[r].classList[0]===game3){
    count++;
    
  }
  }
  if(count>=5){
    if((this.fastfivewinners<=this.fastFivewinner.length)){
      let title ='';
      let desc = 'Fast Five already completed';
      this.tossterwarning(title,desc) 
    }else{
        var objwinner = {};
        objwinner['idprizetype']=3;
        objwinner['idticket']=ticketId;
        objwinner['idtournament']=this.paramsid;
        objwinner['idcustomer']=this.user.id;
        this.firstSecondThirdRow(objwinner);
        event.srcElement.classList.add('selected');
      }
   

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
        //  console.log('winnerCreate',winnerCreate)
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
fourCorners(event,ticketId,clss){
  var count=0;
  var game1 =0+'_'+ticketId;
  var game2 =1+'_'+ticketId;
  var game3 =2+'_'+ticketId;
  var selectedValues = new Array();
    for(let r=0; r<clss.length; r++){
     if(clss[r].classList[0]===game1 || clss[r].classList[0]===game2 || clss[r].classList[0]===game3){
      selectedValues[r]=clss[r].textContent
      }
    }
    
    let f4 =this.fourcornersNum[ticketId];
    if (Array.isArray(f4) && f4.length) {
      
      f4.forEach(function(value, index) {
        selectedValues.find(element => {
          if(element == value){
            count++
          }
        });
      });

      }
      console.log('count',count)
    if(count>=4){
      if((this.fourcornerswinners <= this.fourCornerswinner.length)){
        let title ='';
        let desc = 'Four Corner alredy Completed';
        this.tossterwarning(title,desc) }else{
          var objwinner = {};
          objwinner['idprizetype']=4;
          objwinner['idticket']=ticketId;
          objwinner['idtournament']=this.paramsid;
          objwinner['idcustomer']=this.user.id;
          this.firstSecondThirdRow(objwinner);
          event.srcElement.classList.add('selected');
        }
     
    }else{
      let title ='';
      let desc = 'Must be select 4 Corners numers';
      this.tossterwarning(title,desc)
    }
  
}

fullhouise(event,ticketId,clss){
  var count=0;
  var game1 =0+'_'+ticketId;
  var game2 =1+'_'+ticketId;
  var game3 =2+'_'+ticketId;
  
    for(let r=0; r<clss.length; r++){
     if(clss[r].classList[0]===game1 || clss[r].classList[0]===game2 || clss[r].classList[0]===game3){
      count++;
     
     }
    }
    if(count>=15){
      var objwinner = {};
      objwinner['idprizetype']=5;
      objwinner['idticket']=ticketId;
      objwinner['idtournament']=this.paramsid;
      objwinner['idcustomer']=this.user.id;
      if((this.fullhousewinners <= this.fullHousiewinner.length)){
        let title ='';
        let desc = 'Four Corner alredy Completed';
        this.tossterwarning(title,desc) 
      }else{
         this.firstSecondThirdRow(objwinner);
      }
      event.srcElement.classList.add('selected');
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
        //  console.log('wineersListbyTourney',wineersListbyTourney.winners)
            this.claim_status_fastFive = true;
            this.outofffaastfive = wineersListbyTourney.outoff.fastFive;
            this.outofffirstRow = wineersListbyTourney.outoff.firstRow;
            this.outoffsecondRow = wineersListbyTourney.outoff.secondRow;
            this.outoffthirdRow = wineersListbyTourney.outoff.thirdRow;
            this.outofffullHousie = wineersListbyTourney.outoff.fullHousie;
            this.outofffourCorners = wineersListbyTourney.outoff.fourCorners;
            this.wineersList = wineersListbyTourney.winners;
            this.fastFivewinner = wineersListbyTourney.winners.fastFive;
            this.firstRowwinner = wineersListbyTourney.winners.firstRow;
            this.secondRowwinner = wineersListbyTourney.winners.secondRow;
            this.thirdRowwinner = wineersListbyTourney.winners.thirdRow;
            this.fullHousiewinner = wineersListbyTourney.winners.fullHousie;
            this.fourCornerswinner = wineersListbyTourney.winners.fourCorners;
            if(wineersListbyTourney.gameplaystatus == 1){
              var obj = {};  
              obj['status']=2;
              obj['idtournament']=this.paramsid;
              this.accountService.Tornamentupdate(this.paramsid,obj)
              .pipe(first())
                  .subscribe((datasubmit:any)=>{
                            console.log('join',datasubmit)
                                          
                      }, (err) => {
                        console.log(err);
                      });
              let title ='';
              let desc = 'Game Completed';
              console.log('Game Completed')
              this.tossterwarning(title,desc)
              if (this.timerwinner) {
                clearInterval(this.timerwinner); 
              }
              if (this.timer) {
                clearInterval(this.timer); 
              }
              setTimeout(()=>{
               this.router.navigate(['/game-history/'+this.paramsid]);	 
              },3000); 

              }

            

  
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
onWindowResize(event) {
  this.width = event.target.innerWidth;
  this.height = event.target.innerHeight;
  this.isMobile = this.mobileWidth < this.width;
}
ngOnDestroy() {
  // Will clear when component is destroyed e.g. route is navigated away from.
  
  if (this.timerwinner) {
    clearInterval(this.timerwinner); 
  }
  if (this.timer) {
    clearInterval(this.timer); 
  }
  if(this.setVoice){
    clearInterval(this.setVoice); 
  }
}
removeElementsWithValue(arr, val) {
  var i = arr.length;
  while (i--) {
      if (arr[i] === val) {
          arr.splice(i, 1);
      }
  }
  return arr;
}
CompareFourCorner(){
let first = [2, 4, 6, 7, 1];
let second = [4, 1, 7, 6, 2];
let areEqual = (first, second) => {
     for(let i = 0; i < first.length; i++){
      if(!second.includes(first[i])){
         return false;
      };
   };
   return true;
};

}

start() {
  this.html = "1";

  var temporalDivElement = document.createElement("div");
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = this.html;
  // Retrieve the text property of the element (cross-browser support)
  this.result =this.currentNumber;

  this.speech
    .speak({
      text: this.result
    })
    .then(() => {
      console.log("Success !");
    })
    .catch(e => {
      console.error("An error occurred :", e);
    });
}

}