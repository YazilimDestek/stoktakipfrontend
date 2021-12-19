import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../utils';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AppConfig } from 'src/app/app.config';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private http: Http, 
    private appConfig: AppConfig
  ) { }

  getCompanyWithKeyword() {
    
  }
  getCompanies(){
    return this.http.get(this.appConfig.apiUrl + '/company', this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));

  }
  getCompany(id){
    return this.http.get(this.appConfig.apiUrl + '/company/' + id, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  createCompany(company){
    return this.http.post(this.appConfig.apiUrl + '/company',company, this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));

  }
  updateCompany(company){
    return this.http.put(this.appConfig.apiUrl + '/company/' + company.id, company, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  deleteCompany(id){
    return this.http.delete(this.appConfig.apiUrl + '/company/' + id, this.jwt())
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
