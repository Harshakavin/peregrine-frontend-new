import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';
import {RequestOptions} from "http";


@Injectable()
export class ApiService {
  production: false;

  api_url: String = '';
    // 'https://tracified-admin.herokuapp.com/api/';
    // 'http://localhost:5000/api/';
    // 'https://tracified-admin.herokuapp.com/api/';
    // 'http://localhost:5000/api/';

  api_url2: String = '';
    // 'https://tracified-admin.herokuapp.com/sign';
    // 'http://localhost:5000/sign';
    // 'https://tracified-admin.herokuapp.com/sign';
    // 'http://localhost:5000/sign';

  constructor(private http: Http, private  httpC: HttpClient) {
  }

  // Setting Headers for API Request
  private setHeaders(): Headers  {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
    headersConfig['Authorization'] = `Bearer root`;
    return new Headers(headersConfig);
  }
   private setHeaders2(): Headers  {
    // const headersConfig = {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Accept': 'application/json',
    // };
        let headers = new Headers();
       headers.append('Content-Type','application/x-www-form-urlencoded');
       headers.append('Accept', 'application/json');
       headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
       headers.append('Access-Control-Allow-Origin', '*');
       headers.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
        // let options = new RequestOptions();

        // 'Access-Control-Allow-Origin','*');
        // headers('Access-Control-Allow-Headers','Content-Type');
        // headers('Access-Control-Allow-Methods','GET','POST','PUT','DELETE','OPTIONS');
        // headers.append('Access-Control-Allow-Credentials', true);
    return headers;
  }


  // Format Error Messages
  private formatErrors(error: any) {
    return Observable.throw(error.json());
  }

  // Perform a GET Request
  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {

   console.log(path.split('/')[1]);
    console.log('1 url is ' + `${this.api_url}${path}`);
    return this.http.get(`${this.api_url}${path}`, { headers: this.setHeaders(), search: params });
      // .catch(this.formatErrors)
      // .map((res: Response) => {
      //   res.json();
      //   console.log("responce in get method" + JSON.stringify(res.json()));
      //   //console.log('respone in get methods' + this.formatErrors)
      // });


  }

  // // Perform a PUT Request
  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${this.api_url}${path}`,
      body,
      {headers: this.setHeaders()}
    ).pipe(
      map((res) => res) // or any other operator
    );
  }
  // pushFileToStorage(file: File): Observable<any> {
  //   const formdata: FormData = new FormData();
  //   formdata.append('file', file);
  //   const reques = new HttpRequest('POST', 'http://13.127.163.78:8080/s3/uploadFile', formdata, {
  //     reportProgress: true,
  //     responseType: 'text'
  //   });
  //   return this.httpC.request(reques);
  // }

  // Perform POST Request
  post(path, body): Observable<any> {
    let Url: String;
    console.log(path);
    Url = this.api_url;
    console.log(Url + path);
    return this.http.post(
      `${Url}${path}`, body,
      { headers : this.setHeaders() }
    ).pipe(
      map((res) => res) // or any other operator
      );
    // .catch(res => {
    //   console.log('err');
    //   console.log(res);
    //   return Observable.throw(res.json());
    // })
  }

  // Perform Delete Request
  delete(path): Observable<any> {
    return this.http.delete(
      `${this.api_url}${path}`,
      { headers: this.setHeaders() }
    );
      // .catch(this.formatErrors)
      // .map((res: Response) => res.json());
  }

      // .catch(this.formatErrors)


  SummarizPost(path, body): Observable<any> {
    let Url: String;
    console.log(path);
    Url = this.api_url;
    console.log(Url + path);
    return this.http.post(
      `${Url}${path}`, body,
      { headers : this.setHeaders() }
    ).pipe(
      map((res) => res) // or any other operator
      );
  }
}
