import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public nav: number;

  constructor() {
    this.nav = 1;
  }
  public navigate(num: number) {
    this.nav = num;
  }

}
