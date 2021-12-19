import { Injectable } from "@angular/core";
import { AppConfig } from '../.../../../app.config';
import { LocalStoreService } from "./local-store.service";
import { Http, URLSearchParams, RequestOptions, Response ,Headers} from '@angular/http';
import { Router } from "@angular/router";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  //Only for demo purpose
  authenticated = false;

  constructor(private store: LocalStoreService, private router: Router, private http: Http, private appConfig: AppConfig) {
    this.checkAuth();
  }

  checkAuth() {
    // this.authenticated = this.store.getItem("demo_login_status");
  }

  getuser() {
    return of({});
  }

  signin(credentials) {
    return this.http.post(this.appConfig.apiUrl + '/login', credentials)
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  
  signout() {
    this.authenticated = false;
    this.store.setItem("Token", null);
    this.router.navigateByUrl("/sessions/signin");
  }
}
