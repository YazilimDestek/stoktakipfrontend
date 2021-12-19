import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ItemtypeService } from 'src/app/shared/services/itemtype.service';
import { Router } from '@angular/router';
import { isThisISOWeek } from 'date-fns';

@Component({
	selector: 'itemtypes',
	templateUrl: './itemtypes.component.html',
	styleUrls: []
})
export class ItemtypesComponent implements OnInit {
	itemTypes: any[];
	itemTypeForm: FormGroup;
	itemType: any = {};
	editMode = false;
    itemTypeDetail: any = {};
    public loading;
    modalReference : NgbModalRef;

	constructor(
		private service: ItemtypeService,
		private _fb: FormBuilder,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router
	) { 
		this.itemTypeForm = this._fb.group({
			name: ['', [Validators.required]],
          });
	}

	ngOnInit() {
        this.load();
	}

	load() {
        this.loading = true;
        this.service.getall().subscribe(result => {
                if(result.meta.isSuccess == true){
                    this.itemTypes = result.entities;
                }else{
                    this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                }
            },(error: Response) => {
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

	getDetail(id, detailModal){
        this.loading = true;
        this.service.get(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.itemTypeDetail = result.entity;
                this.loading = false;
            }else{
                this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
            }
            
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
        this.modalService.open(detailModal, { size:'lg', ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
            }, (reason) => {
            });
    }

	addNew(request){
        this.itemType = {};
        this.editMode = false;
		this.modalReference = this.modalService.open(request, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
    }
    save(){
        if(this.itemTypeForm.valid){
            this.loading = true;
            if(!this.itemType.id){
                this.service.create(this.itemType).subscribe(result => {
                    this.loading = false;
                    if(result.meta.isSuccess == true){
                        this.load();
                        this.toastr.success('Ürün Tipi Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
                        this.modalReference.close()
                    }else{
                        this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                    }
                },(error: Response) => {
                    this.loading = false;
                    if(error.status === 401){
                        this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                        localStorage.removeItem('Token');
                        this.router.navigateByUrl('/sessions/signin');
                    }else {
                        this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                    }
                });
            }else if(this.itemType.id){
                this.service.update(this.itemType).subscribe(result => {
                    //console.log(result);
                    this.toastr.success('Ürün Tipi Güncellendi!', 'Başarılı!', { timeOut: 3000 });
                    this.load();
                    this.modalReference.close()
                    this.loading = false;
               },(error: Response) => {
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

        }else{
            this.validateAllFormFields(this.itemTypeForm)
        }

    }

	updateItemType(id, request){
        this.loading = true;
		this.service.get(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.itemType = result.entity;
                this.loading = false;
            }else{
                this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
            }
            
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
        this.modalReference = this.modalService.open(request, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
          }, (reason) => {
        });
        this.editMode = true;
	}
	delete(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.loading = true;
                this.service.delete(id)
                    .subscribe(res => {
                        this.toastr.success('Ürün Tipi Silindi!', 'Başarılı!', { timeOut: 3000 });
                        this.load();
                        this.loading = false;
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
            }, (reason) => {
            });
    }

    isFieldValidForms(field: string) {
        return !this.itemTypeForm.get(field).valid && this.itemTypeForm.get(field).touched;
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
