import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AppConfig } from 'src/app/app.config';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: Http, 
    private appConfig: AppConfig
  ) { }
  getUsers(){
    return this.http.get(this.appConfig.apiUrl + '/user', this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));

  }
  getUser(id){
    return this.http.get(this.appConfig.apiUrl + '/user/' + id, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  createUser(user){
    return this.http.post(this.appConfig.apiUrl + '/user',user, this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));

  }
  updateUser(user){
    return this.http.put(this.appConfig.apiUrl + '/user/' + user.id, user, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  deleteUser(id){
    return this.http.delete(this.appConfig.apiUrl + '/user/' + id, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  
  changePassword(user){
    return this.http.put(this.appConfig.apiUrl + '/user/update-profile', user, this.jwt())
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
