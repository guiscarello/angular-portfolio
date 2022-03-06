import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as e from 'express';
import { data } from 'jquery';
import { Login } from 'src/app/interfaces/Login';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router
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
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        //console.log("Response sent from the server: " + response);
        this.authService.getRolesFromToken();
        this.route.navigate(["/main"]);

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
