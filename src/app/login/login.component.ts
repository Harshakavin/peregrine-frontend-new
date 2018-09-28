import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../shared/api.service';
import stringHash from 'string-hash';
import {CurrsentUser} from '../shared/Currsent-User';
import {JwtHelper} from 'angular2-jwt';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public onlineFlag = navigator.onLine;
  public EmptyCredential = false;
  public invalidCredential = false;
  public loading = '';
  private sha512: any;
  constructor(private router: Router , private  apiService: ApiService, private c_user: CurrsentUser) {
    this.loginForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(6)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      });
  }

  ngOnInit() {
    this.sha512 = require('hash.js/lib/hash/sha/512');
  }
  public onSubmit() {
    this.EmptyCredential = false;
    if (this.loginForm.valid) {
      this.loading = 'm-progress';
      console.log(this.loginForm.get('username').value + ': ' + this.loginForm.get('password').value);
      const pw = this.sha512().update(this.loginForm.get('username').value + this.loginForm.get('password').value).digest('hex');
      console.log(pw);
      const user = {
        username : this.loginForm.get('username').value,
        password : pw
      };
      console.log(pw);
     this.apiService.post('http://localhost:5000/api/login', user )
     .subscribe((data) => {
         console.log(data._body);
         this.loading = "";
         const token = JSON.parse(data._body).token;
         const jwtHelper: JwtHelper = new JwtHelper();
         window.sessionStorage.setItem('token', token);
         // console.log(jwtHelper.decodeToken(token));
         // var jwt = require('jsonwebtoken');
         // abcd1234console.log(decoded1);
         // this.c_user.name = decoded1[]
         this.router.navigate(['/tool']);
      }, (err) => {
          console.log(err);
          this.loading = "";
          this.EmptyCredential = true;
     });
    } else if (this.loginForm.get('username').value || this.loginForm.get('password').value) {
      this.EmptyCredential = true;
    }
  }

}
