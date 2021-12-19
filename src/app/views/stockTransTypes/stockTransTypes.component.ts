import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/shared/services/location.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StockService } from 'src/app/shared/services/stock.service';
import { Router } from '@angular/router';
import { isThisISOWeek } from 'date-fns';

@Component({
	selector: 'stockTransTypes',
	templateUrl: './stockTransTypes.component.html',
	styleUrls: []
})
export class StockTransTypesComponent implements OnInit {
	transTypes: any[];
	transferTypeForm: FormGroup;
	transferType: any = {};
	editMode = false;
    transTypeDetail: any = {};
    public loading;
    modalReference : NgbModalRef

	constructor(
        private stockService: StockService,
		private _fb: FormBuilder,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
	) { 
		this.transferTypeForm = this._fb.group({
			name: ['',[Validators.required]],
			refCode:[''],
            documentRequired: false,
            useForMobileBarcode: false,
            useForMobileQrcode: false
          });
	}

	ngOnInit() {
        this.loadTransTypes();
	}
	loadTransTypes() {
        this.loading= true;
        this.stockService.getStockTransTypes()
            .subscribe(results => {
                this.transTypes = results;
                this.loading = false;
                //console.log(this.transTypes)
            },(error: Response) => {
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
	getDetail(id, detailModal){
        this.stockService.getStockTransType(id).subscribe(result => {
            this.transTypeDetail = result.entity;
            //console.log("detail",this.transTypeDetail)
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

	addNewTransType(newTransferType){
        this.transferType = {};
        this.editMode = false;
		this.modalReference = this.modalService.open(newTransferType, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
    }
    save(){
        if(this.transferTypeForm.valid){
            this.loading = true;
            if(!this.transferType.id){
                this.stockService.createStockTransType(this.transferType).subscribe(result => {
                
                    if(result.meta.isSuccess == true){
                        this.loadTransTypes();
                        this.loading = false;
                        this.toastr.success('Transfer Tipi Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
                        this.modalReference.close();
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

            }else if(this.transferType.id){
                this.stockService.updateStockTransType(this.transferType).subscribe(result => {
                    //console.log(result);
                    this.loadTransTypes();
                    this.loading = false;
                    this.modalReference.close();
                    this.toastr.success('Transfer Tipi Güncellendi!', 'Başarılı!', { timeOut: 3000 });
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
            this.validateAllFormFields(this.transferTypeForm)
        }
    }
	updateTransType(id, updateTransType){
        this.loading = true;
		this.stockService.getStockTransType(id).subscribe(transferType => {
            this.transferType = transferType.entity;
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
        this.modalReference = this.modalService.open(updateTransType, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
        this.editMode = true;
	}
	deleteTransType(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.loading = true;
                this.stockService.deleteStockTransType(id)
                    .subscribe(res => {
                        this.toastr.success('Transfer Tipi Silindi!', 'Başarılı!', { timeOut: 3000 });
                        this.loadTransTypes();
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
            }, (reason) => {
            });
    }

    isFieldValidForms(field: string) {
        return !this.transferTypeForm.get(field).valid && this.transferTypeForm.get(field).touched;
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
