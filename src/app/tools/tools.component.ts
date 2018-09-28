import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../shared/api.service';
import {HttpRequest} from '@angular/common/http';
import {element} from 'protractor';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {JwtHelper} from 'angular2-jwt';


@Component({
  selector: 'app-upload',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {


  title = 'Peregrine editor';
  public username: string;
  public name: string;
  public comment: string;
  public count = 0;
  public submit = '';
  public popState = false;
  public loading = '';
  public tab = true;
  private message = '';
  public templates = [];
  public step = 1;
  latestRelease: any = {};
  private subscription: Subject<any> = new Subject();

  editorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '300px',
    translate: 'yes',
    enableToolbar: true,
    placeholder: 'Type your article.....',
    showToolbar: true,
  };

  public htmlContent: any = '';
  public summarizeContent: any;
  public similarContent: any;
  public scanContent: any;

  public summarized: any;
  public addedUsers: any[] = [];
  private scanResults: any[];
  private articleId: string;
  private similarArticles: any[];
  private userslist = [ {name : 'Tissa Abeysekera', email: 'TissaAbeysekera@gmail.com' },
    {name: 'Nihal De Silva', email: 'Nihal@gmail.com' },
    {name: 'Vijita Fernando', email: 'VijitaFernando@gmail.com' },
    {name: 'Romesh Gunesekera', email: 'RomeshGunesekera@gmail.com' },
    {name: 'Shehan Karunatilaka', email: 'ShehanKarunatilaka@gmail.com' },
    {name: 'Punyakante Wijenaike', email: 'PunyakanteWijenaike@gmail.com' }];
  private user: string;
  private email: string;
  private allMail: any[] = [];
  private checkReview: string;
  private article: any;
  private inbox: any[] = [];

  constructor(private apiService: ApiService, private router: Router, private jwtHelper: JwtHelper) {
    if (!window.sessionStorage.getItem('token')) {
       this.router.navigate(['/view']);
    } else {
         this.username = jwtHelper.decodeToken(window.sessionStorage.getItem('token')).name;
    }
  }

  ngOnInit() {
    this.getArticles();
    this.getReviewArticles();
  }

  public wordCount() {
    this.count = this.htmlContent.split(' ').length;
  }

  public change(num: number) {
    if (this.step === 1 && num !== 1) {
      this.popState = true;
    }
    if (num === 5) {
      this.getArticles();
    }
    if (num === 3) {
      this.scanResults = [];
    }
    this.step = num;
     this.loading = '';
  }

  public summarize() {
   console.log(this.summarizeContent);
   const oParser = new DOMParser();
    this.loading = 'm-progress';
   const oDOM = oParser.parseFromString(this.summarizeContent, 'text/html');
   const text = oDOM.body.innerText;
   this.summarized = '';
    this.apiService.post('https://obscure-citadel-80764.herokuapp.com/api/summarizeArticles', {content: text} )
     .subscribe((data) => {
       console.log(data._body);
       this.summarized = data._body.toString().split('"').join();
       this.loading = '';
       this.popState = true;
     }, (err) => {
       console.log(err);
       this.popState = true;
        this.summarized = 'Sorry ! this article connot be summrized.';
     });
  }

  public serchSimilarArticles() {


     console.log(this.similarContent);
     const oParser = new DOMParser();
     this.loading = 'm-progress';
     const oDOM = oParser.parseFromString(this.similarContent, 'text/html');
     const text = oDOM.body.innerText;
     this.similarArticles = [];
     this.apiService.post('http://localhost:5000/similarity', {query: text} )
     .subscribe((data) => {

          console.log(data._body);
          this.similarArticles = JSON.parse(data._body);
          this.loading = '';

          this.popState = true;
     }, (err) => {
          console.log(err);
           this.message = 'Sorry ! We connot find similar articles.';
     });



  }

  public save() {
   if (this.count >= 1 && this.name !== '') {
   this.loading = 'm-progress';
   this.apiService.post('https://obscure-citadel-80764.herokuapp.com/api/save', {'content': this.htmlContent, 'name': this.name})
     .subscribe((data) => {
       console.log(data._body);
       // this.templates = JSON.parse(data._body);
       this.message = 'Your article is safe!';
       this.loading = '';
       this.popState = true;
     }, (err) => {
       console.log(err);
       this.popState = true;
       this.loading = '';
       this.message = 'Sorry article connot save !';
     });
   } else {
        this.popState = true;
        this.loading = '';
        this.message = 'Empty article cannot be saved!';
   }
  }

  public scan() {

    console.log(this.scanContent);
    const oParser = new DOMParser();
    this.loading = 'm-progress';
    this.scanResults = [];
    const oDOM = oParser.parseFromString(this.scanContent, 'text/html');
    const text = oDOM.body.innerText;
    this.apiService.post('http://localhost:8000', {'data': [{ 'content': text }]})
     .subscribe((data) => {
       console.log(data);
       this.loading = '';
     }, (err) => {
       console.log(err);
       this.loading = '';

     });
    this.scanResults = [];

    const violate = [
      {'content': 'Vidya', 'reason': 'Disclosing personal details of victims of rape'},
      {'content': 'Pukudi', 'reason': 'Disclosing personal details of victims'},
    ];
    violate.forEach(element4 => {
      if ( text.indexOf(element4.content) >= 0) {

        this.scanResults.push(element4);

     }
     this.loading = '';
    });


  }

  public getArticles() {

    this.apiService.get('https://obscure-citadel-80764.herokuapp.com/api/getAllsavedArticles')
      .subscribe((data) => {
        // console.log(data._body);
        this.templates = JSON.parse(data._body);


      }, (err) => {
        console.log(err);
        setTimeout(() => {
        }, 3000);
      });
  }
  public setDeleteId(id: string) {
    this.articleId = id ;
    this.popState = false;
    this.submit = '';
  }

 public deleteArticles() {
    console.log(this.articleId);
    this.popState = true;
    this.submit = 'm-progress';
     this.apiService.delete('https://obscure-citadel-80764.herokuapp.com/api/deleteArticles/' +  this.articleId)
      .subscribe((data) => {
        console.log(data._body);
         this.submit = '';
         this.message = 'Your article deleted.';
         this.getArticles();
          this.articleId = '';

      }, (err) => {
        console.log(err);
          this.message = 'Sorry Your article cannot be delete.!';
          this.submit = '';
           this.articleId = '';
      });

  }


  public  reset() {
    this.message = '';
    this.popState = false;
    this.loading = '';
    this.submit = '';
    this.addedUsers = [];

  }
  public use(content: string) {
    this.htmlContent = content;
    this.step = 1;
    this.popState = false;
  }
  public setValue(uName: any) {
    const uObj =  this.userslist.find( user => user.name === uName );
    this.user = uObj.name;
    this.email = uObj.email;

  }

  public addUsers() {
    const result = this.addedUsers.find( user => user.name === this.user );
    console.log(result);
    if (!result) {

      this.addedUsers.push({'name': this.user, 'status': '', 'email': this.email});
    }
  }

  public submitToReview() {

    if (this.addedUsers.length > 0 && this.name !== '' && this.htmlContent.split(' ').length > 2   ) {
      const obj = {
      username: 'pasansilva@gmail.com',
      senders: this.addedUsers,
      time: new Date(),
      content: this.htmlContent,
      subject: this.name,
      status: 'Pending',
    };
      this.loading = 'm-progress';
       this.message = '';
     this.apiService.post('https://lit-scrubland-90930.herokuapp.com/api/submit', obj)
     .subscribe((data) => {
       console.log(data._body);
       // this.templates = JSON.parse(data._body);
       this.message = 'Your article is submitted!';
       this.loading = '';
       this.popState = true;
       this.getReviewArticles();
     }, (err) => {
       console.log(err);
       this.popState = true;
       this.loading = '';
       this.message = 'Sorry article connot submitt !';

     });
   } else {
        // this.popState = true;
        this.loading = '';
        this.message = 'Proper articles and fields are mandatory !';
   }
  }
   public check(article) {
          const userReview = article.senders.find( send => send.email === 'pasansilva@gmail.com');
          console.log(userReview);
          return userReview.status;
          // if (userReview) {
          //    return userReview.status;
          // } else {
          //    return userReview.status;
          // }
   }

   public getReviewArticles() {
     this.checkReview = '';
      this.inbox = [];
       this.allMail = [];
     this.apiService.get('https://lit-scrubland-90930.herokuapp.com/api/getAllSubmitArticles')
      .subscribe((data) => {
        console.log(data._body);
        this.allMail = JSON.parse(data._body);
        this.allMail.forEach( element5 => {
          const userReview = element5.senders.find( send => send.email === 'pasansilva@gmail.com');
          console.log(userReview);
          if (userReview) {
            this.inbox.push(element5);
            // this.checkReview = userReview.status;
            // this.comment = this.checkReview;
          }
        });
      }, (err) => {
        console.log(err);
        setTimeout(() => {
        }, 3000);
      });

   }

   public getRightContent(article: string): string {
      const oParser = new DOMParser();
     this.loading = 'm-progress';
     const oDOM = oParser.parseFromString(article, 'text/html');
     const text = oDOM.body.innerText;
     return text;
   }

  public submitReview(article: any) {
   this.article = article;
   console.log(this.loading );
   this.submit = '';
  }

  public updateReview() {

   if (this.comment !== '') {
     this.submit = 'm-progress';
    const filterOne: any[] = this.article.senders.filter(el => el.email !== 'pasansilva@gmail.com');
    const cUser: any =  this.article.senders.find(el => el.email === 'pasansilva@gmail.com');
    filterOne.push({'name': cUser.name, 'status': this.comment, 'email': cUser.email});
    this.article.senders = filterOne;
    this.apiService.put('https://lit-scrubland-90930.herokuapp.com/api/review',  this.article)
     .subscribe((data) => {
       console.log(data._body);
       // this.templates = JSON.parse(data._body);
       this.message = 'Your review submitted!';
       this.submit = '';
       this.popState = true;
       this.getReviewArticles();
     }, (err) => {
       console.log(err);
       this.popState = true;
       this.submit = '';
       this.message = 'Sorry article connot review !';
     });

    } else {
       this.popState = true;
       this.submit = '';
       this.message = 'Please enter your comment!';
   }
  }
  public setComment(comment: any) {
    console.log(comment.value);
    this.comment = comment.value;
  }
}
