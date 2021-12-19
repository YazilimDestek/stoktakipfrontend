import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../utils';
import { Observable } from 'rxjs';
import { LocalStoreService } from './local-store.service';
import { Router } from '@angular/router';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private store: LocalStoreService, 
    private router: Router, 
    private http: Http, 
    private appConfig: AppConfig
  ) { }

  // Stock History Service //
  getStockHistories(filter){
    return this.http.post(this.appConfig.apiUrl + '/stock', filter, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getStockHistory(id){
    return this.http.get(this.appConfig.apiUrl + '/stock/' + id, this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  createStockHistory(transfer){
    return this.http.post(this.appConfig.apiUrl + '/stock/move',transfer, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  uploadImage(formData){
    return this.http.post(this.appConfig.apiUrl + '/stock/upload',formData, this.jwt())
            .map(res => res).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  searchItem(search){
    return this.http.post(this.appConfig.apiUrl + '/item/search',search, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  searchItemVariants(id){
    return this.http.get(this.appConfig.apiUrl + '/item/variants/' + id, this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
   /// Stock Transfer Types Servive  ///
   getStockTransTypes(){
    return this.http.get(this.appConfig.apiUrl + '/transtype', this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  createStockTransType(transferType){
    return this.http.post(this.appConfig.apiUrl + '/transtype',transferType, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getStockTransType(id){
    return this.http.get(this.appConfig.apiUrl + '/transtype/' + id, this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  updateStockTransType(transferType){
    return this.http.put(this.appConfig.apiUrl + '/transtype/' + transferType.id, transferType, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  deleteStockTransType(id){
    return this.http.delete(this.appConfig.apiUrl + '/transtype/' + id, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getDelayedStockHistoryDetail(){
    return this.http.get(this.appConfig.apiUrl + '/stock/stockmovementdetailcounts', this.jwt())
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

