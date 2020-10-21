import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.less']
})
export class AboutUsComponent implements OnInit {

  result : any;
 
  constructor(private accountService: AccountService) {}

  ngOnInit() {
      this.accountService.AboutUs()
          .pipe(first())
          .subscribe((res:any) =>{
              this.result = res.pageDetail;             
          }   );
  }

  
}
