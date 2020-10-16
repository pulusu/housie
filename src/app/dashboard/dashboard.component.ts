import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { ToastrService } from 'ngx-toastr';
import { Router} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  users = null;
  user:any;
  orderedcheck=false;
  clicked=false;
  numberoftickets=0;
  selectedOptiontickets:number;
  constructor(private accountService: AccountService, 
    private toastr: ToastrService,
    private router: Router
    ) {
    this.user = this.accountService.userValue;
    console.log('user',this.user.id)
  }

  ngOnInit() {
    this.user = this.accountService.userValue;
    var obj = {};  
    obj['idcustomer']=this.user.id;
      this.accountService.tournamentsAllbyCustomer(obj)
          .pipe(first())
          .subscribe((datasubmit:any)=>{
            console.log(datasubmit.tournaments[0].orders.length)
              for(let i=0; i<datasubmit.tournaments.length; i++){
                if(datasubmit.tournaments[i].orders.length>0){
                  datasubmit.tournaments[i]['orders']=true;
                }else{
                  datasubmit.tournaments[i]['orders']=false;
                }
              }
              this.users = datasubmit.tournaments
              console.log('datasubmit',datasubmit.tournaments)

              let title ='';
              let desc = 'Welcome To Kairos Houise';
           //   this.tosstersuccess(title,desc)

            }, (err) => {
                console.log(err);
              });
  }
  handleChange(index) {
    this.numberoftickets = index;
    console.log('index',index)
  }
  joibGame(event, tourny:any) {
    if(this.numberoftickets>0){
      this.clicked = true;
    var obj = {};  
    obj['idcustomer']=this.user.id;
    obj['idtournament']=tourny._id;
    obj['numberoftickets']=this.numberoftickets;
    obj['amount']=tourny.ticketprice;
    this.accountService.joinTorney(obj)
          .pipe(first())
          .subscribe((datasubmit:any)=>{
                     console.log('join',datasubmit.orderDetails.idtournament[0])
                     if(datasubmit.error==false){
                        let title ='';
                        let desc = 'Joined Succuessfuly';
                        this.tosstersuccess(title,desc)
                        setTimeout(()=>{
                          this.router.navigate(['/play-game/'+datasubmit.orderDetails.idtournament[0]]);	 
                          },1000); 
                    
                     }else{
                      let title ='';
                      let desc = 'Oops wrong.. Try again later';
                      this.tossterwarning(title,desc)
                     }
       
              }, (err) => {
                console.log(err);
              });
    }else{
      let title ='';
      let desc = 'Select number of tickets';
      this.tossterwarning(title,desc)
    }
    
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