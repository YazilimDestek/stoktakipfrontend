import { ReportService } from './../../shared/services/report.service';
import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { echartStyles } from '../../shared/echart-styles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'reports',
	templateUrl: './reports.component.html',
	styleUrls: []
})
export class ReportsComponent implements OnInit {
	reports: any[];
	reportForm: FormGroup;
	report: any = {};
	editMode = false;
	constructor(
		private reportService : ReportService,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private _fb: FormBuilder,
	) { 
		this.reportForm = this._fb.group({
			name:['']
		})
	}

	ngOnInit() {
		this.loadReports();
	}
	loadReports(){
		this.reportService.getReports().subscribe(result => {
			this.reports = result;
		})
	}
	addNewReport(modal){
		this.report = {};
        this.editMode = false;
        this.modalService.open(modal, {size: 'lg', windowClass: 'modal-adaptive'})
        .result.then((result) => {
            this.reportService.createReport(this.report).subscribe(result => {
                this.loadReports();
            })
        }, (reason) => {
        });
	}
	updateReport(id, modal){
        this.reportService.getReport(id).subscribe(result => {
            this.report = result;
        })
        this.modalService.open(modal, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then(() => {
				console.log(this.report);
                this.reportService.updateReport(this.report).subscribe(result => {
                    console.log(result);
                }, (reason) => {
                });
        });
    }
    deleteReport(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then(() => {
                this.reportService.deleteReport(id)
                    .subscribe(res => {
                        this.toastr.success('Rapor Silindi!', 'Success!', { timeOut: 3000 });
                        this.loadReports();
                    })
            }, (reason) => {
            });
    }

}
