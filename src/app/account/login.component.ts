import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import Speech from "speak-tts";

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    formForgotPassword: FormGroup;
    formVerifyOtp : FormGroup;
    changePasswordform : FormGroup;
    loading = false;
    submitted = false;
    mobile = '';
    html = "";
  result = "";
  paramsid='';
  speech: any;
  speechData: any;
  params:any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private toastr: ToastrService,
        private alertService: AlertService
    ) { 
      
      
        this.speech = new Speech(); 
    if (this.speech.hasBrowserSupport()) {
      // returns a boolean
      console.log("speech synthesis supported");
      this.speech
        .init({
          volume: 1,
          lang: "en-GB",
          rate: 1,
          pitch: 1,
          voice: "Google UK English Female",
          splitSentences: true,
          listeners: {
            onvoiceschanged: voices => {
             // console.log("Event voiceschanged", voices);
            }
          }
        })
        .then(data => {
          this.speechData = data;
          data.voices.forEach(voice => {
          //  console.log(voice.name + " " + voice.lang);
          });
        })
        .catch(e => {
          console.error("An error occured while initializing : ", e);
        });
    }
    }
    getUser(id){
      this.accountService.getById(id)
      .pipe(first())
      .subscribe(
          (data:any)=> {
             console.log('user-data',data)
             this.mobile=data.mobile;
          },
          error => {
              this.alertService.error(error);
              this.loading = false;
          }
      );
    }

    ngOnInit() {
      console.log('params',this.route.snapshot.url)
     
      if(this.route.snapshot.url.length >0){
      this.params = this.route.snapshot.url[0].path;
      if(this.params == 'verify-otp'){
       
         this.paramsid = this.route.snapshot.url[1].path;

         this.getUser(this.paramsid);
      }
      if(this.params == 'change-password'){
       
         this.paramsid = this.route.snapshot.url[1].path;
         this.getUser(this.paramsid);
      }

      }
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.formForgotPassword = this.formBuilder.group({
          mobile: ['', Validators.required]
        });
        this.formVerifyOtp = this.formBuilder.group({
          otp: ['', Validators.required]
        });
        this.changePasswordform = this.formBuilder.group({
          password: ['', Validators.required],
          cpassword: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    get fg() { return this.formForgotPassword.controls; }
    get o() { return this.formVerifyOtp.controls; }
    get ch() { return this.changePasswordform.controls; }
    onSubmitForgotPassword(){
      this.submitted = true;
       if (this.formForgotPassword.invalid) {
          return;
       }
       this.loading = true;
       let obj = {};  
       obj['mobile']=this.fg.mobile.value
       this.accountService.ForgotPassword(obj)
            .pipe(first())
            .subscribe(
                (data:any)=> {
                    
                    if(data.error==false){
                      const returnUrl = '/account/verify-otp/'+data.userdetails.id;
                      this.router.navigateByUrl(returnUrl);      
                     console.log('data',data)
                      this.loading = false;
                      let title ='';
                      let neme =data.otp_details;
                      let desc =data.message+ ' Your registered email' ;
                      this.tosstersuccess(title,desc)
                     }else{
                         this.loading = false;
                         let title ='';
                         let desc =data.message;
                         this.tossterwarning(title,desc)
                    }
                 
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            );
       
    }
    onSubmitOTP(){
      this.submitted = true;
       if (this.formVerifyOtp.invalid) {
          return;
       }
       this.loading = true;
       let obj = {};  
       obj['mobile']=this.mobile;
       obj['otp']=this.o.otp.value;
       console.log('obj',obj)
       this.accountService.VerifyOtp(obj)
            .pipe(first())
            .subscribe(
                (data:any)=> {
                    if(data.error==false){
                      const returnUrl = '/account/change-password/'+this.paramsid;
                      this.router.navigateByUrl(returnUrl);      
                     console.log('data',data)
                      this.loading = false;
                      let title ='';
                      let neme =data.otp_details;
                      let desc =data.message;
                      this.tosstersuccess(title,desc)
                     }else{
                         this.loading = false;
                         let title ='';
                         let desc =data.message;
                         this.tossterwarning(title,desc)
                    }
                 
                },
                error => {
                    this.loading = false;
                }
            );
       
    }
    changePasswordonSubmit() {
      this.submitted = true;
      this.alertService.clear();
      if (this.changePasswordform.invalid) {
          return;
      }else if(this.ch.password.value != this.ch.cpassword.value){
        this.loading = false;
        let title ='';
        let desc ="Password , confirm password Not match";
        this.tossterwarning(title,desc);
        return;
      }
      this.loading = true;
      let obj = {};  
      obj['mobile']=this.mobile;
      obj['password']=this.ch.password.value;
      this.accountService.changePassword(obj)
           .pipe(first())
           .subscribe(
               (data:any)=> {
                   if(data.error==false){
                     const returnUrl = '/account/login/';
                     this.router.navigateByUrl(returnUrl);      
                     this.loading = false;
                     let title ='';
                     let neme =data.otp_details;
                     let desc ='Password changed successfully';
                     this.tosstersuccess(title,desc)
                    }else{
                      console.log('dataerror',data)
                        this.loading = false;
                        let title ='';
                        let desc =data.message;
                        this.tossterwarning(title,desc)
                   }
                
               },
               error => {
                   this.loading = false;
               }
           );
    }
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
                      let neme =data.response.name;
                      let desc ='LogedIn successfully';
                      this.tosstersuccess(title,desc)
                      this.speachVoice('Welcome '+neme)
                    }else{
                         this.loading = false;
                         let title ='';
                         let desc =data.message;
                         this.tossterwarning(title,desc)
                    }
                    // get return url from query parameters or default to home page
                 
                },
                error => {
                    this.alertService.error(error);
                    console.log('error',error)
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

      speachVoice(value) {
        this.html = "1";
      
        var temporalDivElement = document.createElement("div");
        temporalDivElement.innerHTML = this.html;
        this.result =value;
        this.speech
          .speak({
            text: this.result
          })
          .then(() => {
            console.log("Success !");
          })
          .catch(e => {
            console.error("An error occurred :", e);
          });
      }
      

}