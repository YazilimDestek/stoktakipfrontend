import { Utils } from 'src/app/shared/utils';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
export class CategoryService {

  constructor(
    private store: LocalStoreService, 
    private router: Router, 
    private http: Http, 
    private appConfig: AppConfig
  ) { }

  getCategories(){
    return this.http.get(this.appConfig.apiUrl + '/category', this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));

  }
  getCategory(id){
    return this.http.get(this.appConfig.apiUrl + '/category/' + id, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }

  createCategory(category){
    return this.http.post(this.appConfig.apiUrl + '/category',category, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));

  }
  updateCategory(category){
    return this.http.put(this.appConfig.apiUrl + '/category/' + category.id, category, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }

  deleteCategory(id){
    return this.http.delete(this.appConfig.apiUrl + '/category/' + id, this.jwt())
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
