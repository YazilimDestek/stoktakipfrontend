import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from 'src/app/shared/services/brand.service';
import { Router } from '@angular/router';

@Component({
	selector: 'brands',
	templateUrl: './brands.component.html',
	styleUrls: []
})
export class BrandsComponent implements OnInit {
	brands: any[];
	brandForm: FormGroup;
	brand: any = {};
	editMode = false;
    brandDetail: any = {};
    public loading;
    modalReference: NgbModalRef;

	constructor(
		private brandService: BrandService,
		private _fb: FormBuilder,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router
	) { 
		this.brandForm = this._fb.group({
			name: ['', [Validators.required]],
          });
	}

	ngOnInit() {
        this.loadBrands();
	}
	loadBrands() {
        this.brandService.getBrands()
            .subscribe(results => {
                this.brands = results;
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
        this.brandService.getBrand(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.brandDetail = result.entity;
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

	addNewBrand(newBrand){
        this.brand = {};
        this.editMode = false;
		this.modalReference = this.modalService.open(newBrand, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
    }
    save(){
        if(this.brandForm.valid){
            this.loading = true;
            if(!this.brand.id){
                this.brandService.createBrand(this.brand).subscribe(result => {
                    this.loading = false;
                    if(result.meta.isSuccess == true){
                        this.loadBrands();
                        this.modalReference.close();
                        this.toastr.success('Marka Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
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
            }else if(this.brand.id){
                this.brandService.updateBrand(this.brand).subscribe(result => {
                    //console.log(result);
                    this.loadBrands();
                    this.loading = false;
                    this.modalReference.close();
                    this.toastr.success('Marka Güncellendi!', 'Başarılı!', { timeOut: 3000 });
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
            this.validateAllFormFields(this.brandForm)

        }
    }
	updateBrand(id, updateBrand){
        this.loading = true;
		this.brandService.getBrand(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.brand = result.entity;
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
        this.modalReference = this.modalService.open(updateBrand, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
        this.editMode = true;
	}
	deleteBrand(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.loading = true;
                this.brandService.deleteBrand(id)
                    .subscribe(res => {
                        this.toastr.success('Marka Silindi!', 'Başarılı!', { timeOut: 3000 });
                        this.loadBrands();
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
        return !this.brandForm.get(field).valid && this.brandForm.get(field).touched;
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
