import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-mytournaments',
  templateUrl: './mytournaments.component.html',
  styleUrls: ['./mytournaments.component.less']
})
export class MytournamentsComponent implements OnInit {

  tournaments = null;
  user:any;
 
  constructor(private accountService: AccountService) {
    this.user = this.accountService.userValue;
    console.log('user',this.user.id)
  }

  ngOnInit() {
    var obj = {};  
    obj['idcustomer']=this.user.id;
      this.accountService.tourneysHistoryByUser(obj)
          .pipe(first())
          .subscribe(response =>{
              this.tournaments = response.response;
              console.log('ssss',response);
            
          }   );
  }

  
}
