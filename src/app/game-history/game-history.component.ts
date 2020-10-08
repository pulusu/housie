import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.less']
})
export class GameHistoryComponent implements OnInit {
  tourneyDeatails:any;
  wineersList:any;
  fastFivewinner:any;
  firstRowwinner:any;
  secondRowwinner:any;
  thirdRowwinner:any;
  fullHousiewinner:any;
  fourCornerswinner:any;
  paramsid:any;
  user:any;
  
  constructor(private accountService: AccountService,    private route: ActivatedRoute
    ) {
      this.user = this.accountService.userValue;
 
    }

  ngOnInit() {
    this.paramsid = this.route.snapshot.params['id'];
    var obj = {};  
    obj['idtournament']=this.paramsid;
    this.wineersListbyTourney(obj);
  }
  wineersListbyTourney(objwinner){
    this.accountService.wineersListbyTourney(objwinner)
          .pipe(first())
          .subscribe((wineersListbyTourney:any)=>{
            console.log('wineersListbyTourney',wineersListbyTourney)
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

}
