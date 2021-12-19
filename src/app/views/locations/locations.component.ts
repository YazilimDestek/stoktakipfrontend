import { CompanyService } from './../../shared/services/company.service';
import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { echartStyles } from '../../shared/echart-styles';
import { LocationService } from 'src/app/shared/services/location.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
	selector: 'locations',
	templateUrl: './locations.component.html',
	styleUrls: []
})
export class LocationsComponent implements OnInit {
    companies: any[];
    locations: any[];
    locationTypes: any[];
	locationForm: FormGroup;
	location: any = {};
	editMode = false;
	phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    locationDetail: any = {};
    locationStockDetail: any[] = [];
    public loading;
    modalReference : NgbModalRef

	constructor(
        private locationService: LocationService,
        private companyService: CompanyService,
		private _fb: FormBuilder,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router
	) { 
		this.locationForm = this._fb.group({
			name: ['', [Validators.required]],
            locationTypeId: [0, [Validators.required]],
            companyId: [0, [Validators.required]],
          });
	}

	ngOnInit() {
        this.loadLocations();
	}
	loadLocations() {
        this.loading = true;
        this.locationService.getLocations()
            .subscribe(results => {
                this.locations = results;
                this.loading = false;
            },
            (error: Response) => {
                this.loading = false;
                if(error.status === 401){
                    this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                    localStorage.removeItem('Token');
                    this.router.navigateByUrl('/sessions/signin');
                } else {
                    this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                }
            });
            this.companyService.getCompanies()
            .subscribe(res => {
                this.companies = res;
            },
            (error: Response) => {
                this.loading = false;
                if(error.status === 401){
                    this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                    localStorage.removeItem('Token');
                    this.router.navigateByUrl('/sessions/signin');
                } else {
                    this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                }
            });
            this.locationService.getLocationTypes().subscribe(types => {
                this.locationTypes = types;
            },
            (error: Response) => {
                this.loading = false;
                if(error.status === 401){
                    this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                    localStorage.removeItem('Token');
                    this.router.navigateByUrl('/sessions/signin');
                } else {
                    this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                }
            });
	}
	getDetail(id, detailModal){
        this.loading = true;
        this.locationService.getLocation(id).subscribe(result => {
            
            if(result.meta.isSuccess == true){
                this.locationDetail = result.entity;
                //console.log(result);
                this.loading = false;
            }else{
                this.toastr.error('Lokasyon!', result.meta.errorMessage, { timeOut: 5000 });
            }
        },
        (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            } else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        });
        this.locationStockDetail = [];
        this.locationService.getLocationStockDetail(id).subscribe( result => {
            console.log("kalan detay",result);
            if(result.entities){
                this.locationStockDetail = result.entities;
            }
            
        });
        this.modalService.open(detailModal, { size:'lg', ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
            }, (reason) => {
            });
    }

	addNewLocation(newLocation){
        this.location = {};
        
        this.modalReference = this.modalService.open(newLocation, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
	}
	updateLocation(id, updateLocation){
        this.loading = true;
		this.locationService.getLocation(id).subscribe(result => {
            
            if(result.meta.isSuccess == true){
                this.location = result.entity;
                this.loading = false;
            }else{
                this.toastr.error('Lokasyon!', result.meta.errorMessage, { timeOut: 5000 });
            }
        },
        (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            } else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        });
        this.modalReference = this.modalService.open(updateLocation, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
        this.editMode = true;
    }
    saveLocation(){
        if(this.locationForm.valid){
            this.loading = true;
            if(!this.location.id){
                this.locationService.createLocation(this.location).subscribe(result => {
                    this.loading = false;
                    if(result.meta.isSuccess == true){
                        //console.log("location",result);
                        this.loadLocations();
                        this.modalReference.close();
                        this.toastr.success('Depo Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
                    }else{
                        this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                    }
                },
                (error: Response) => {
                    this.loading = false;
                    if(error.status === 401){
                        this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                        localStorage.removeItem('Token');
                        this.router.navigateByUrl('/sessions/signin');
                    } else {
                        this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                    }
                });

            }else if(this.location.id){
                this.locationService.updateLocation(this.location).subscribe(result => {
                    this.loadLocations();
                    this.loading = false;
                    this.modalReference.close();
                    this.toastr.success('Depo Güncellendi!', 'Başarılı!', { timeOut: 3000 });
                },
                (error: Response) => {
                    this.loading = false;
                    if(error.status === 401){
                        this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                        localStorage.removeItem('Token');
                        this.router.navigateByUrl('/sessions/signin');
                    } else {
                        this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                    }
                });
            }
        }else{
            this.validateAllFormFields(this.locationForm)
        }
    }
	deleteLocation(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.loading = true;
                this.locationService.deleteLocation(id)
                    .subscribe(res => {
                        this.toastr.success('Depo Silindi!', 'Başarılı!', { timeOut: 3000 });
                        this.loadLocations();
                    },
                    (error: Response) => {
                        this.loading = false;
                        if(error.status === 401){
                            this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                            localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                        } else {
                            this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                        }
                    });
            }, (reason) => {
            });
    }

    isFieldValidForms(field: string) {
        return !this.locationForm.get(field).valid && this.locationForm.get(field).touched;
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
