import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient
  ) { }

  
  getReports(){
    return this.http.get<any[]>('api/reports/');
  }
  getReport(id){
    return this.http.get<any[]>('api/reports/'+id);
  }
  createReport(report){
    report.id= Utils.genId();
    return this.http.post<any[]>('api/reports/', report);
  }
  updateReport(report){
    return this.http.put<any[]>('api/reports/'+report.id, report);
  }
  deleteReport(id){
    return this.http.delete<any[]>('api/reports/'+id);
  }
  
}
