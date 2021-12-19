import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ItemkindService } from 'src/app/shared/services/itemkind.service';
import { Router } from '@angular/router';

@Component({
	selector: 'itemkinds',
	templateUrl: './itemkinds.component.html',
	styleUrls: []
})
export class ItemkindsComponent implements OnInit {
	itemKinds: any[];
	itemKindForm: FormGroup;
	itemKind: any = {};
	editMode = false;
    itemKindDetail: any = {};
    public loading;
    modalReference : NgbModalRef;

	constructor(
		private service: ItemkindService,
		private _fb: FormBuilder,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router
	) { 
		this.itemKindForm = this._fb.group({
			name: ['', [Validators.required]],
          });
	}

	ngOnInit() {
        this.load();
	}

	load() {
        this.loading = true;
        this.service.getall()
            .subscribe(result => {
                this.loading = false;
                if(result.meta.isSuccess == true){
                    this.itemKinds = result.entities;
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
                this.itemKindDetail = result.entity;
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
        this.itemKind = {};
        this.editMode = false;
		this.modalReference = this.modalService.open(request, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
          }, (reason) => {
        });
    }
    
    save(){
        if(this.itemKindForm.valid){
            this.loading = true;
            if(!this.itemKind.id){
                this.service.create(this.itemKind).subscribe(result => {
                    this.loading = false;
                    if(result.meta.isSuccess == true){
                        this.load();
                        this.modalReference.close();
                        this.toastr.success('Ürün Türü Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
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
            }else if(this.itemKind.id){
                this.service.update(this.itemKind).subscribe(result => {
                    //console.log(result);
                    this.load();
                    this.loading = false;
                    this.modalReference.close();
                    this.toastr.success('Ürün Türü Güncellendi!', 'Başarılı!', { timeOut: 3000 });
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
            this.validateAllFormFields(this.itemKindForm)
        }
    }

	updateItemKind(id, request){
        this.loading = true;
		this.service.get(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.itemKind = result.entity;
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
                        this.toastr.success('Ürün Türü Silindi!', 'Başarılı!', { timeOut: 3000 });
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
        return !this.itemKindForm.get(field).valid && this.itemKindForm.get(field).touched;
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
