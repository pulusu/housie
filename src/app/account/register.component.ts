import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
			confirmpassword: ['', [Validators.required]]
			
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
            return;
        }else{
			this.showotpForm  = true;
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
	
	
	onFormSubmit() {
		
		this.otpsubmitted = true;
		this.showotpForm  = true;

        // reset alerts on submit
        this.alertService.clear();

        // this.loading = true;
    let firstArray = this.form.value;
    let secondArray = this.otpform.value;
	
	console.log('firstArray',firstArray)
console.log('secondArray',secondArray)

var obj3 = Object.assign({},firstArray, secondArray);  
console.log('obj3',obj3)
//obj3.created_by=this.currentTrackUser._id; 
//console.log('this.obj3',thobj3)
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
			res => { 
					if(res['error'] == false)
					{
						this.router.navigate(['../login'], { relativeTo: this.route });
					}
					else
					{
			         var msg = res['message'];
					 console.log('error message', msg);
					 alert(msg);
					}					 
					
            },
			error => {
					console.log(error);
                    this.loading = false;
                });
	}
		
    }
	
	
}