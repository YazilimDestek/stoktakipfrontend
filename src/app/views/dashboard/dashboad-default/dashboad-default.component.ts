import { Component, OnInit, ViewChild } from '@angular/core';
import { EChartOption } from 'echarts';
import { echartStyles } from '../../../shared/echart-styles';
import { StockService } from 'src/app/shared/services/stock.service';
import { isThisQuarter } from 'date-fns';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
	selector: 'app-dashboad-default',
	templateUrl: './dashboad-default.component.html',
	styleUrls: ['./dashboad-default.component.css']
})
export class DashboadDefaultComponent implements OnInit {
	chartLineOption1: EChartOption;
	chartLineOption2: EChartOption;
	chartLineOption3: EChartOption;
    salesChartBar: EChartOption;
    salesChartPie: EChartOption;
    dashboardData : any = {};
    showStockHistoryList : boolean = false;
    timeoutItems : any[] = [];
    expanded: any = {};
    dashboardDataCount : any[] = [];
    dashboardDataDate : any[] = [];
    chartData=new Array(20)
    lastTwentyDays:any[]=[];
    @ViewChild('myTable', { static: false }) table: any;

	constructor(
        private stockHistoryService :StockService,
        public datepipe: DatePipe
    ) { }

	ngOnInit() {

        this.getLastTwentyDays();
        this.timeoutItems = [];
        this.stockHistoryService.getDelayedStockHistoryDetail().subscribe( result => {
            if(result.meta.isSuccess){
                this.dashboardData = result.entity;
                if(this.dashboardData.timeoutItems){
                    this.timeoutItems = this.dashboardData.timeoutItems;
                }
                this.chartData.fill(0)
                if(result.entity.lastTwentyDays){
                    result.entity.lastTwentyDays.map((x=>{
                        let x_date =this.datepipe.transform(x.date, 'dd/MM/yyyy');
                        var index=this.findIndexInLastTwentyDays(x_date)
                        if(index>-1)
                        this.chartData[index]=x.count;
                       }))
                }
                this.functionDrawChart(this.chartData);
            }
            
        });	
    }

    getLastTwentyDays(){
        let now = moment();
       var array=[];
        for(let i=0; i<20; i++){
           var date= moment(now).add(-i,'days')
               array.push(date.format("DD/MM/YYYY"))
        }
           this.lastTwentyDays=array.reverse()

    }

    findIndexInLastTwentyDays(date){
       return this.lastTwentyDays.findIndex(x=>x==date)
      
    }
    functionDrawChart(dashboardDataCount){


        this.chartLineOption3 = {
            ...echartStyles.lineNoAxis, ...{
                series: [{
                    data:  dashboardDataCount,
                    lineStyle: {
                        color: 'rgba(102, 51, 153, 0.86)',
                        width: 3,
                        ...echartStyles.lineShadow
                    },
                    label: { show: true, color: '#212121' },
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        borderColor: 'rgba(102, 51, 153, 1)'
                    }
                }]
            }
        };		 this.chartLineOption3.xAxis.data = this.lastTwentyDays;
    }
    toggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
      }

}
