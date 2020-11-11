import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';


@Component({
  selector: 'app-tournaments-list-admin',
  templateUrl: './tournaments-list-admin.component.html',
  styleUrls: ['./tournaments-list-admin.component.less']
})
export class TournamentsListAdminComponent implements OnInit {

  tournaments = null;
 
  constructor(private accountService: AccountService) {}

  ngOnInit() {
      this.accountService.tournamentsAll()
          .pipe(first())
          .subscribe(response =>{
              this.tournaments = response.tournaments;
              console.log(this.tournaments);
            
          }   );
  }

  deleteTourney(id: string) {
      this.accountService.delete(id)
          .pipe(first())
          .subscribe(() => this.tournaments = this.tournaments.filter(x => x.id !== id));
  }
}