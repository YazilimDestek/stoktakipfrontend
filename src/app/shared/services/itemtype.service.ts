import { AppConfig } from './../../app.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../utils';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class ItemtypeService {

  constructor(
    private http: Http, 
    private appConfig: AppConfig
  ) { }

  getall(){
    return this.http.get(this.appConfig.apiUrl + '/itemtype', this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  
  get(id){
    return this.http.get(this.appConfig.apiUrl + '/itemtype/' + id, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }

  create(request){
    return this.http.post(this.appConfig.apiUrl + '/itemtype',request, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }

  update(request){
    return this.http.put(this.appConfig.apiUrl + '/itemtype/' + request.id, request, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }

  delete(id){
    return this.http.delete(this.appConfig.apiUrl + '/itemtype/' + id, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }

  private jwt() {
    // create authorization header with jwt token
    let userToken = JSON.parse(localStorage.getItem('Token'));
    if (userToken) {
        let headers = new Headers({ 'Authorization': 'Bearer ' +  userToken});
        return new RequestOptions({ headers: headers });
    }
  }
  
}
