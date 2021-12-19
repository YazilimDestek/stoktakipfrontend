import { StockService } from 'src/app/shared/services/stock.service';
import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/shared/services/location.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TimeOutService } from 'src/app/shared/services/timeout.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Router } from '@angular/router';

@Component({
	selector: 'timeouts',
	templateUrl: './timeouts.component.html',
	styleUrls: []
})
export class TimeOutComponent implements OnInit {
    public colorAfterTimeout: string = '#ffffff';
    public colorAfterTransfer: string = '#ffffff';
	timeouts: any[];
	timeoutForm: FormGroup;
	timeout: any = {};
	editMode = false;
    timeoutDetail: any = {};
    locations: any[];
    transTypes: any [];
    categories: any[];
    public loading;
    modalReference: NgbModalRef;
	constructor(
        private timeoutService: TimeOutService,
        private locationService: LocationService,
        private stockService: StockService,
        private categoryService : CategoryService,
		private _fb: FormBuilder,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
	) { 
		this.timeoutForm = this._fb.group({
			name: [''],
			locationId: [0, [Validators.required]],
            transTypeId: [0, [Validators.required]],
            categoryId: [0, [Validators.required]],
            days:[0],
            colorAfterTimeout:[''],
            colorAfterTransfer:[''],
          });
	}

	ngOnInit() {
        this.loadTimeOuts();
	}
	loadTimeOuts() {
        this.loading = true;
        this.timeoutService.getTimeOuts().subscribe(results => {
                this.timeouts = results;
                this.loading = false;
            }, (error: Response) => {
                this.loading = false;
                if(error.status === 401){
                    this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                    localStorage.removeItem('Token');
                    this.router.navigateByUrl('/sessions/signin');
                }else {
                    this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                }
            })
        this.locationService.getLocations().subscribe(result => {
                this.locations = result;
                }, (error: Response) => {
                if(error.status === 401){
                    this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                    localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                }else {
                    this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                }
        });
        this.stockService.getStockTransTypes().subscribe(result => {
                this.transTypes = result;
                }, (error: Response) => {
                if(error.status === 401){
                    this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                    localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                }else {
                    this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                }
        });
        this.categoryService.getCategories().subscribe(result => {
            
            if(result.meta.isSuccess == true){
                this.categories = result.entities;
            }else{
                this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
            }
        }, (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        });
    }
    onChangeColorTimeOut(event){
        this.timeout.colorAfterTimeout = event; 
    }
    onChangeColorTransfer(event){
        this.timeout.colorAfterTransfer = event;
    }
    getTimeOutDetail(id, detailModal){
        this.loading = true;
        this.timeoutService.getTimeOut(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.loading = false;
                this.timeoutDetail = result.entity;
                //console.log(result);
            }else{
                this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
            }
            
        }, (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        })
        this.modalService.open(detailModal, { size:'lg', ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
            }, (reason) => {
            });
    }

	addNewTimeout(newTimeOut){
        this.timeout = {};
        this.editMode = false;
        this.colorAfterTimeout  = '#ffffff';
        this.colorAfterTransfer  = '#ffffff';
        this.timeout.colorAfterTimeout  = '#ffffff'; // kullanıcı bir renk seçmediğinde colorpicker undefined görünmemesi için.
        this.timeout.colorAfterTransfer  = '#ffffff';
		this.modalReference = this.modalService.open(newTimeOut, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
    }
    save(){
        if(this.timeoutForm.valid){
            if(!this.timeout.id){
                this.timeoutService.createTimeOut(this.timeout).subscribe(result => {
                
                    if(result.meta.isSuccess == true){
                        this.loadTimeOuts();
                        this.loading = false;
                        this.modalReference.close();
                        this.toastr.success('Zaman Aşımı Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
                    }else{
                        this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                    }
                }, (error: Response) => {
                    this.loading = false;
                    if(error.status === 401){
                        this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                        localStorage.removeItem('Token');
                        this.router.navigateByUrl('/sessions/signin');
                    }else {
                        this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                    }
                })
            }else if(this.timeout.id){
                this.timeoutService.updateTimeOut(this.timeout).subscribe(result => {
                    //console.log(result);
                    this.loading = false;
                    this.loadTimeOuts();
                    this.modalReference.close();
                    this.toastr.success('Zaman Aşımı Güncellendi!', 'Başarılı!', { timeOut: 3000 });
                }, (error: Response) => {
                    this.loading = false;
                    if(error.status === 401){
                        this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                        localStorage.removeItem('Token');
                        this.router.navigateByUrl('/sessions/signin');
                    }else {
                        this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                    }
                })

            }
        }else{
            this.validateAllFormFields(this.timeoutForm)
        }
    }
	updateTimeOut(id, updateTimeOut){
		this.timeoutService.getTimeOut(id).subscribe(timeout => {
            this.timeout = timeout.entity;
            this.colorAfterTimeout = this.timeout.colorAfterTimeout;
            this.colorAfterTransfer = this.timeout.colorAfterTransfer;
        })
        this.modalReference = this.modalService.open(updateTimeOut, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
	}
	deleteTimeOut(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.loading = true;
                this.timeoutService.deleteTimeOut(id)
                    .subscribe(res => {
                        this.loading = false;
                        this.toastr.success('Zaman Aşımı Tanımı Silindi!', 'Başarılı!', { timeOut: 3000 });
                        this.loadTimeOuts();
                    }, (error: Response) => {
                        this.loading = false;
                        if(error.status === 401){
                            this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                            localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                        }else {
                            this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                        }
                    });
            }, (reason) => {
            });
    }
    isFieldValidForms(field: string) {
        return !this.timeoutForm.get(field).valid && this.timeoutForm.get(field).touched;
    }


    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
	


}
