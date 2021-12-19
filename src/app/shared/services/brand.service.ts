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
export class BrandService {

  constructor(
    private http: Http, 
    private appConfig: AppConfig
  ) { }

  getBrands(){
    return this.http.get(this.appConfig.apiUrl + '/brand', this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getBrand(id){
    return this.http.get(this.appConfig.apiUrl + '/brand/' + id, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  createBrand(brand){
    return this.http.post(this.appConfig.apiUrl + '/brand',brand, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  updateBrand(brand){
    return this.http.put(this.appConfig.apiUrl + '/brand/' + brand.id, brand, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  deleteBrand(id){
    return this.http.delete(this.appConfig.apiUrl + '/brand/' + id, this.jwt())
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
