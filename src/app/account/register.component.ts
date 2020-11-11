import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

import { AccountService, AlertService } from '@app/_services';

export interface company{
  value: string;
  viewValue: string;
}
@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
	currentTrackUser
	Message:string='';
    form: FormGroup;
    otpform: FormGroup;
	obj3:any;
    loading = false;
    submitted = false;
	showotpForm = false;
	otpsubmitted = false;
	selectedCompany: string = '';
	//selectedCompanyOthers: string = '';
companies: company[] = [
    {value: 'kairostech', viewValue: 'Kairos'},
    {value: 'solunus', viewValue: 'Solunus'},
	{value: 'mergenit', viewValue: 'Mergen'},
    {value: 'orabasesolutions', viewValue: 'Orabase'},
    {value: 'quantsystemsinc', viewValue: 'Quant'},
    {value: 'kairostech.com|solunus.com|mergenit.com|orabasesolutions.com|quantsystemsinc', viewValue: 'Others'},
    
  ];
  selectChangeHandler (event: any) {
    //update the ui
    this.selectedCompany = event.target.value;
	
  }
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private toastr: ToastrService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            displayname: ['', Validators.required],
            name: ['', Validators.required],
            email: ['', Validators.required],
            mobile: ['', Validators.required],
            company: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
			//confirmPassword: ['', Validators.compose([Validators.required])]
		//	confirmpassword: ['', [Validators.required]]
			
        });
		this.otpform = this.formBuilder.group({
            otp: ['', Validators.required]
            
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    get fval() { return this.otpform.controls; }

    onSubmit() {
		this.showotpForm  = false;
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
		
        if (this.form.invalid) {
            console.log('this.form',this.form)
            return;
        }else{
			
			this.accountService.otp(this.form.value)
			.pipe(first())
			.subscribe(
                (res:any) => { 
                    console.log(res);
                        if(res.error == false)
                        {
                            this.showotpForm  = true;
                        }
                        else
                        {
                         let title ='';
                         let desc =res.message;
                         this.tossterwarning(title,desc)
                        }					 
                        
                },
                error => {
                        console.log(error);
                        this.loading = false;
                    });
		}	

       // this.loading = true;
    
		
    }
	
	
	onFormSubmit() {
		
		this.otpsubmitted = true;
		this.showotpForm  = true;

        // reset alerts on submit
        this.alertService.clear();

        // this.loading = true;
    let firstArray = this.form.value;
    let secondArray = this.otpform.value;
	


var obj3 = Object.assign({},firstArray, secondArray);  
console.log('obj3',obj3)
if (this.otpform.invalid) {
            return;
        }
		if(this.otpform.value == ''){

      this.otpform.value.otp = '';
      this.Message="Please enter valid OTP";
  	 
    }else{
        this.accountService.register(obj3)
		
            .pipe(first())
            .subscribe(
			(res:any) => { 
					if(res.error == false)
					{
						this.router.navigate(['../login'], { relativeTo: this.route });
					}
					else
					{
                        let title ='';
                        let desc =res.message;
                        this.tossterwarning(title,desc)
                        
					}					 
					
            },
			error => {
					console.log(error);
                    this.loading = false;
                });
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