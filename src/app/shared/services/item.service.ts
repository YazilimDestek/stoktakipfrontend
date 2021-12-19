import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../utils';
import { AppConfig } from '../.../../../app.config';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { LocalStoreService } from './local-store.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  
  constructor(
    private store: LocalStoreService, 
    private router: Router, 
    private http: Http, 
    private appConfig: AppConfig
  ) { }

  getItems(filter) {
    return this.http.post(this.appConfig.apiUrl + '/item', filter, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  getItem(serialnumber, brandid){
    return this.http.get(this.appConfig.apiUrl + '/item/' + serialnumber + '/' + brandid, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }

  getItemWithBarcode(barcode){
  }

  createItem(item){
    return this.http.post(this.appConfig.apiUrl + '/item/create', item, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  updateItem(item){
    return this.http.put(this.appConfig.apiUrl + '/item/' + item.serialNumber + '/' + item.brandId, item, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  deleteItem(item){
    return this.http.delete(this.appConfig.apiUrl + '/item/' + item.serialNumber + '/' + item.brandId, this.jwt())
            .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  saveVariant(variant){
  }
  getVariants(){
  }
  public exportAsExcelFile(json: any[]): void {
    
    //const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    //const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'test');
    XLSX.writeFile(wb, 'urunler.xlsx');
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
