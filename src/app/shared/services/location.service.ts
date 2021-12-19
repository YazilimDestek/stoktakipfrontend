import { Injectable } from '@angular/core';
import { Utils } from '../utils';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AppConfig } from 'src/app/app.config';
import { Router } from '@angular/router';
import { LocalStoreService } from './local-store.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private store: LocalStoreService, 
    private router: Router, 
    private http: Http, 
    private appConfig: AppConfig
  ) { }

  getLocations(){
    return this.http.get(this.appConfig.apiUrl + '/location', this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getLocation(id){
    return this.http.get(this.appConfig.apiUrl + '/location/' + id, this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getLocationStockDetail(id){
    return this.http.get(this.appConfig.apiUrl + '/location/locationdetail/' + id, this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getLocationWithKeyword(keyword) {

  }
  createLocation(location){
    return this.http.post(this.appConfig.apiUrl + '/location',location, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  updateLocation(location){
    return this.http.put(this.appConfig.apiUrl + '/location/' + location.id, location, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  deleteLocation(id){
    return this.http.delete(this.appConfig.apiUrl + '/location/' + id, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }

  // location Types Service //
  
  getLocationTypes(){
    return this.http.get(this.appConfig.apiUrl + '/locationtype', this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getLocationType(id){
    return this.http.get(this.appConfig.apiUrl + '/locationtype/' + id, this.jwt())
    .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  createLocationType(locationtype){
    return this.http.post(this.appConfig.apiUrl + '/locationtype',locationtype, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  updateLocationType(locationtype){
    return this.http.put(this.appConfig.apiUrl + '/locationtype/' + locationtype.id, locationtype, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  deleteLocationType(id){
    return this.http.delete(this.appConfig.apiUrl + '/locationtype/' + id, this.jwt())
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
