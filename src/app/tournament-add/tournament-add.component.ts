import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { ThemePalette } from '@angular/material/core';
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

  tickets: ticket[] = [
    {value: '1', viewValue: 'Yes'},
    {value: '0', viewValue: 'No'},
	
  ];
  
  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private accountService: AccountService,
        private alertService: AlertService
  ) { }

  ngOnInit() {

   

	  this.form = this.formBuilder.group({
            
            name: ['', Validators.required],
            ticketprice: ['', Validators.required],
            fastfivewinners: ['', Validators.required],
            fastprizevalue: ['', Validators.required],
            fourcornerswinners: ['', Validators.required],
            fourcornersvalue: ['', Validators.required],
            firstrowwinners: ['', Validators.required],
            firstrowvalue: ['', Validators.required],
			      secondrowwinners: ['', Validators.required],
            secondrowvalue: ['', Validators.required],
            thirdrowwinners: ['', Validators.required],
            thirdrowvalue: ['', Validators.required],
            fullhousewinners: ['', Validators.required],
            fullhousevalue: ['', Validators.required],
            multipletickets: ['', Validators.required],
            totaltickets: ['', Validators.required],
            registrationenddate: [{ value: '', disabled: true }, Validators.required],
            startdate: [{ value: '', disabled: true }, Validators.required],
            
           
        });
        this.form.get('startdate').setValue(new Date()),
        this.form.get('registrationenddate').setValue(new Date()),
        this.form.get('startdate').enable();
        this.form.get('registrationenddate').enable();
  }
  get f() { return this.form.controls; }
  onSubmit() {
		    this.submitted = true;
       this.alertService.clear();
      

        if (this.form.invalid) {
          console.log('this.form.z',this.form.value)
            return;
        }else{
			//this.showotpForm  = true;
			this.accountService.tournamentsCreate(this.form.value)
			.pipe(first())
          .subscribe((datasubmit:any)=>{
                     console.log('join',datasubmit)
                     if(datasubmit.error==false){
                        this.loading = false;
                        let title ='';
                        let desc = 'Tourney Created Succuessfuly';
                        this.tosstersuccess(title,desc)
                        setTimeout(()=>{
                          this.router.navigate(['/dashboard/']);	 
                          },1000); 
                    
                     }else{
                      let title ='';
                      let desc = 'Oops wrong.. Try again later';
                      this.tossterwarning(title,desc)
                     }
       
              }, (err) => {
                console.log(err);
              });
		}	

       // this.loading = true;
    
		
    }
 onlyNumberKey(event) {
      return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
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
