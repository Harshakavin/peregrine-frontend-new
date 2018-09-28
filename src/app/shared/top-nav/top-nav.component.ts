import { Component, OnInit } from '@angular/core';
import {JwtHelper} from 'angular2-jwt';
import {flatMap} from 'tslint/lib/utils';
import {Router} from '@angular/router';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  public name;
  public disable = true;
  constructor(private router: Router) {
     const jwtHelper: JwtHelper = new JwtHelper();
    if (window.sessionStorage.getItem('token')) {
         this.name = jwtHelper.decodeToken(window.sessionStorage.getItem('token')).name;
         this.disable = true;
    } else {
         this.disable = false;
    }
  }

  ngOnInit() {
  }

  logout(){
    window.sessionStorage.removeItem('token');
    this.disable = false;
    this.router.navigate(['']);
  }
}
