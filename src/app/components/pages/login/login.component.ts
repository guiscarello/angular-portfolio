import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as e from 'express';
import { data } from 'jquery';
import { Login } from 'src/app/interfaces/Login';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ErrorHandlerService } from 'src/app/services/shared/error/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  badCredentials: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private errorHandlerService: ErrorHandlerService
  ) { 
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        username: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required]
      }
    );
  }

  onSubmit(){
    console.log("Form values:" + this.loginForm.value)
    this.badCredentials = false;
    this.authenticationService.login(this.loginForm.value).subscribe({
      next: response => {
        //console.log("Response sent from the server: " + response);
        //this.authService.getRolesFromToken();
        this.router.navigate(["/main"]);

      },
      error: err => {
        //this.errorHandlerService.httpErrorHandler(err);
        if(err.status === 401){
          this.badCredentials = true;
        } else {
          this.badCredentials = false;
        }
      }
    }

    );
  }

  cancelLogin(): void{
    this.router.navigate(["/"]);
  }

  get Controls(){
    return this.loginForm.controls;
  }

}
