import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../utils';
import { LocalStoreService } from './local-store.service';
import { Router } from '@angular/router';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AppConfig } from 'src/app/app.config';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class TimeOutService {

  constructor(
    private store: LocalStoreService, 
    private router: Router, 
    private http: Http, 
    private appConfig: AppConfig
  ) { }

  getTimeOuts(){
    return this.http.get(this.appConfig.apiUrl + '/timeout', this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getTimeOut(id){
    return this.http.get(this.appConfig.apiUrl + '/timeout/' + id, this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  createTimeOut(timeout){
    return this.http.post(this.appConfig.apiUrl + '/timeout',timeout, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  updateTimeOut(timeout){
    return this.http.put(this.appConfig.apiUrl + '/timeout/' + timeout.id, timeout, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  deleteTimeOut(id){
    return this.http.delete(this.appConfig.apiUrl + '/timeout/' + id, this.jwt())
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
