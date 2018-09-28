import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ToolsComponent} from './tools/tools.component';
import { ViewComponent } from './view/view.component';
import {RouterModule, Routes} from '@angular/router';
import {ApiService} from './shared/api.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { LoginComponent } from './login/login.component';
import { TopNavComponent } from './shared/top-nav/top-nav.component';
import {CurrsentUser} from './shared/Currsent-User';
import {JwtHelper} from 'angular2-jwt';
import { SignupComponent } from './signup/signup.component';
const appRoutes: Routes = [

             { path: 'view', component: ViewComponent },
             { path: 'tool', component: ToolsComponent },
             { path: 'login', component: LoginComponent },
             { path: 'signup', component: SignupComponent },
             { path: '', component: ViewComponent },
             { path: '**', redirectTo: '/view', pathMatch: 'full' }
              // { path: 'view', component: ViewComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ToolsComponent,
    ViewComponent,
    LoginComponent,
    TopNavComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    NgxEditorModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [ApiService,CurrsentUser, JwtHelper],
  bootstrap: [AppComponent]
})
export class AppModule { }
