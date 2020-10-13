import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

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
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
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
        this.accountService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                (data:any)=> {
                    console.log('data',data)
                    if(data.error==false){
                        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                        this.router.navigateByUrl(returnUrl);      
                      this.loading = false;
                      let title ='';
                      let desc ='LogedIn successfully';
                      this.tosstersuccess(title,desc)
                    setTimeout(()=>{
                          //window.location.href = returnUrl;
                    },1000); 

                    }else{
                        //this.alertService.error(data.message);
                         this.loading = false;
                         let title ='';
                         let desc =data.message;
                         this.tossterwarning(title,desc)
                    }
                    // get return url from query parameters or default to home page
                 
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            );
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