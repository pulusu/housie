import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
export interface country{
  value: string;
  viewValue: string;
}
export interface state{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.less']
})
export class AdminUserComponent implements OnInit {
	form: FormGroup;
	isAddMode: boolean;
    loading = false;
    submitted = false;
	countries: country[] = [
    {value: 'india', viewValue: 'India'},
    {value: 'usa', viewValue: 'USA'},
	
  ];
  states: state[] = [
    {value: 'telangana', viewValue: 'Telangana'},
    {value: 'ap', viewValue: 'Ap'},
	
  ];

  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
  ) { }

  ngOnInit(): void {
	  this.form = this.formBuilder.group({
            ename: ['', Validators.required],
            eaddress: ['', Validators.required],
            displayname: ['', Validators.required],
            city: ['', Validators.required],
            email: ['', Validators.required],
            pincode: ['', Validators.required],
            emobile: ['', Validators.required],
            image: ['', Validators.required],
            gender: ['', Validators.required],
            country: ['', Validators.required],
            dob: ['', Validators.required],
            state: ['', Validators.required],
            pancard: ['', Validators.required],
            bankpassbook: ['', Validators.required],
            newpassword: ['', Validators.required],
            confirm_newpassword: ['', Validators.required],
        });
  }
  get f() { return this.form.controls; }
  
  onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            //this.createUser();
        } else {
            //this.updateUser();
        }
    }

}
