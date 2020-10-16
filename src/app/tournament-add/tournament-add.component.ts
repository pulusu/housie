import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from '../../environments/environment';
//import {DlDateTimePickerChange} from '../lib';

import { AccountService, AlertService } from '@app/_services';
export interface prize{
  value: string;
  viewValue: string;
}
export interface ticket{
  value: string;
  viewValue: string;
}
export interface tournament{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-tournament-add',
  templateUrl: './tournament-add.component.html',
  styleUrls: ['./tournament-add.component.less']
})
export class TournamentAddComponent implements OnInit {
form: FormGroup;
loading = false;
submitted = false;
maxView = 'year';
  minView = 'minute';
  minuteStep = 5;
  selectedDate: Date;
  showCalendar = true;
  startView = 'day';
  views = ['minute', 'hour', 'day', 'month', 'year'];
  calendar:any;
  
prizes: prize[] = [
    {value: '1', viewValue: 'Percentage ( % )'},
    {value: '2', viewValue: 'Amount ( рд░ )'},
	{value: '3', viewValue: 'Products'},
    
    
  ];
  tickets: ticket[] = [
    {value: 'yes', viewValue: 'YES'},
    {value: 'no', viewValue: 'NO'},
	
  ];
  
  tournaments: tournament[] = [
    {value: '1', viewValue: 'Special Tournament'},
    
	
  ];
  //onCustomDateChange(event: DlDateTimePickerChange<Date>) {
   // console.log(event.value);
  //}
  //calendar() {
   // $(function() {
   //   $('#datetimepicker1').datetimepicker();
 // });
 // }
  
  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
  ) { }

  ngOnInit() {
	  this.form = this.formBuilder.group({
            
            name: ['', Validators.required],
            prize: ['', Validators.required],
            amount: ['', Validators.required],
            ticketprice: ['', Validators.required],
            fastfivewinners: ['', Validators.required],
            fastfiveprizevalue: ['', Validators.required],
            fourcornerswinners: ['', Validators.required],
            fourcornersprizevalue: ['', Validators.required],
            firstrowwinners: ['', Validators.required],
            firstrowprizevalue: ['', Validators.required],
			
            secondrowwinners: ['', Validators.required],
            secondrowprizevalue: ['', Validators.required],
            thirdrowwinners: ['', Validators.required],
            thirdrowprizevalue: ['', Validators.required],
            fullhousewinners: ['', Validators.required],
            fullhouseprizevalue: ['', Validators.required],
            multipletickets: ['', Validators.required],
            totaltickets: ['', Validators.required],
            regclosedate: ['', Validators.required],
            startdate: ['', Validators.required],
            tournamenttype: ['', Validators.required],
			
            fastfivewinnersfrom: ['', Validators.required],
            fastfivewinnersto: ['', Validators.required],
            fastfivewinnersamount: ['', Validators.required],
			
            fourcornerswinnersfrom: ['', Validators.required],
            fourcornerswinnersto: ['', Validators.required],
            fourcornerswinnersamount: ['', Validators.required],
			
            firstrowwinnersfrom: ['', Validators.required],
            firstrowwinnersto: ['', Validators.required],
            firstrowwinnersamount: ['', Validators.required],
			
            secondrowwinnersfrom: ['', Validators.required],
            secondrowwinnersto: ['', Validators.required],
            secondrowwinnersamount: ['', Validators.required],
			
            thirdrowwinnersfrom: ['', Validators.required],
            thirdrowwinnersto: ['', Validators.required],
            thirdrowwinnersamount: ['', Validators.required],
			
            fullhousewinnersfrom: ['', Validators.required],
            fullhousewinnersto: ['', Validators.required],
            fullhousewinnersamount: ['', Validators.required],
           
        });
  }
  get f() { return this.form.controls; }
  onSubmit() {
		//this.showotpForm  = false;
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
		
        if (this.form.invalid) {
            return;
        }else{
			//this.showotpForm  = true;
			this.accountService.otp(this.form.value)
			.pipe(first())
			.subscribe({
                next: () => {
					
                    //this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    //this.router.navigate(['../login'], { relativeTo: this.route });
					
                },
                error: error => {
					console.log(error)
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
		}	

       // this.loading = true;
    
		
    }

}
