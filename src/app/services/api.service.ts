import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(public http:HttpClient) {}


  fetchData(url){
    return this.http.get(url);
  }
  

  postData(url:string, body: any){
    this.http.post(url, body).toPromise();
  }

}
