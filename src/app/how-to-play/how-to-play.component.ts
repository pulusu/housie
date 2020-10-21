import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.less']
})
export class HowToPlayComponent implements OnInit {

  result : any;
 
  constructor(private accountService: AccountService) {}

  ngOnInit() {
      this.accountService.howToPlay()
          .pipe(first())
          .subscribe((res:any) =>{
              this.result = res.pageDetail;             
          }   );
  }

  
}
