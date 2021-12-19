import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from 'src/app/shared/services/location.service';
import { Router } from '@angular/router';

@Component({
	selector: 'locationTypes',
	templateUrl: './locationTypes.component.html',
	styleUrls: []
})
export class LocationTypesComponent implements OnInit {
	locationTypes: any[];
	locationTypeForm: FormGroup;
	locationType: any = {};
	editMode = false;
    locationTypeDetail: any = {};
    public loading;
    modalReference : NgbModalRef

	constructor(
		private locationTypeService: LocationService,
		private _fb: FormBuilder,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router
	) { 
		this.locationTypeForm = this._fb.group({
			name: ['', [Validators.required]],
          });
	}

	ngOnInit() {
        this.loadLocationTypes();
	}
	loadLocationTypes() {
        this.loading = true;
        this.locationTypeService.getLocationTypes()
            .subscribe(results => {
                this.locationTypes = results;
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
        this.loading = true;
        this.locationTypeService.getLocationType(id).subscribe(result => {
            console.log(result);
            if(result.meta.isSuccess == true){
                this.locationTypeDetail = result.entity;
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

	addNewLocationType(newLocationType){
        this.locationType = {};
        this.editMode = false;
		this.modalReference = this.modalService.open(newLocationType, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
          }, (reason) => {
        });
    }
    save(){
        if(this.locationTypeForm.valid){
            this.loading = true;
            if(!this.locationType.id){
                this.locationTypeService.createLocationType(this.locationType).subscribe(result => {
                    this.loading = false;
                    if(result.meta.isSuccess == true){
                        //console.log(result);
                        this.loadLocationTypes();
                        this.modalReference.close();
                        this.toastr.success('Lokasyon Tipi Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
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
            }else if(this.locationType.id){
                this.locationTypeService.updateLocationType(this.locationType).subscribe(result => {
                    this.loadLocationTypes();
                    this.loading = false;
                    this.modalReference.close();
                    this.toastr.success('Lokasyon Tipi Güncellendi!', 'Başarılı!', { timeOut: 3000 });
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
        } else {
            this.validateAllFormFields(this.locationTypeForm)
        }
    }
	updateLocationType(id, updateLocationType){
        this.loading = true;
		this.locationTypeService.getLocationType(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.locationType = result.entity;
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
        this.modalReference = this.modalService.open(updateLocationType, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
          }, (reason) => {
        });
	}
	deleteLocationType(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.loading = true;
                this.locationTypeService.deleteLocationType(id)
                    .subscribe(res => {
                        this.toastr.success('Lokasyon Tipi Silindi!', 'Başarılı!', { timeOut: 3000 });
                        this.loadLocationTypes();
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
        return !this.locationTypeForm.get(field).valid && this.locationTypeForm.get(field).touched;
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
