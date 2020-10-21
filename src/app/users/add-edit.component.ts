import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { AccountService, AlertService } from '@app/_services';

export interface country{
  value: string;
  viewValue: string;
}
export interface state{
  value: string;
  viewValue: string;
}
@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    url:any;
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
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
       

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            displayname: ['', Validators.required],
            city: [''],
            email: ['', Validators.required],
            pincode: [''],
            mobile: ['', Validators.required],
            gender: [''],
            country: [''],
            dob: [''],
            state: [''],
            password: [''],
            profileimage:['']

        });

        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe((x:any) => {
                    console.log('dob',x)
                    this.form.patchValue(x);
                    this.form.get('dob').setValue(new Date(x.dob))
                    this.url = `${environment.apiUrl}/`+x.profileimage
                    console.log('dob',x)
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            console.log('sss',this.form)
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        this.accountService.CreateUser(this.form.value)
            .pipe(first())
            .subscribe((response:any) =>{
                console.log('response', response)
                if(response.error==false){
                        this.router.navigate(['/users']);
                  }else{
                    console.log(response);
                    this.loading = false;
                          
                  }
                });
    }

    private updateUser() {
        this.form.value.id=this.id;
        console.log('value', this.form.value)
           
        this.accountService.update(this.id, this.form.value)
        .pipe(first())
        .subscribe((response:any) =>{
            if(response.error==false){
                    this.router.navigate(['/users']);
              }else{
                console.log(response);
                this.loading = false;
                      
              }
            });
    }
    readUrl(event:any) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
           
            this.form.patchValue({
                profileimage: file
              });
              // this.form.get('profileimage').setValue(file);
              this.form.get('profileimage').updateValueAndValidity()
      
          var reader = new FileReader();
          reader.onload = (event: ProgressEvent) => {
            this.url = (<FileReader>event.target).result;
          }
      
          reader.readAsDataURL(event.target.files[0]);
        }
      }
}