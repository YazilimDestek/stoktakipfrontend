import { CompanyService } from './../../shared/services/company.service';
import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { echartStyles } from '../../shared/echart-styles';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
	selector: 'companies',
	templateUrl: './companies.component.html',
	styleUrls: []
})
export class CompaniesComponent implements OnInit {
	companies: any[];
	companyForm: FormGroup;
	company: any = {};
	editMode = false;
	companyDetail: any = {};
    phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public loading;
    modalReference : NgbModalRef;

	constructor(
		private companyService: CompanyService,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private _fb: FormBuilder,
        private router: Router,
	) { 
		this.companyForm = this._fb.group({
            name: ['', [Validators.required]],
          });
	}

	ngOnInit() {
		this.loadCompanies();
	}
	loadCompanies() {
        this.companyService.getCompanies()
            .subscribe(res => {
                this.companies = res;
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
    addNewCompany(newCompany){
        this.company = {};
        this.editMode = false;
        this.modalReference = this.modalService.open(newCompany, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
    }
    saveCompany(){
        if(this.companyForm.valid){
            this.loading = true;
            if(!this.company.id){
                
                this.companyService.createCompany(this.company).subscribe(result => {
                    this.loading = false;
                    if(result.meta.isSuccess == true){
                        this.modalReference.close();
                        this.loadCompanies();
                        this.toastr.success('Firma Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
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
            }else if(this.company.id){

                this.companyService.updateCompany(this.company).subscribe(result => {
                    this.loading = false;
                    this.modalReference.close();
                    this.loadCompanies();
                    this.toastr.success('Firma Güncellendi!', 'Başarılı!', { timeOut: 3000 });
                    
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
            this.validateAllFormFields(this.companyForm)
        }
    }
	getDetail(id, detailModal){
        this.loading = true;
        this.companyService.getCompany(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.companyDetail = result.entity;
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
    updateCompany(id, modal){
        this.companyService.getCompany(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.company = result.entity;
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
        });
        this.modalReference = this.modalService.open(modal, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
    }
	deleteCompany(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.loading = true;
                this.companyService.deleteCompany(id)
                    .subscribe(res => {
                        this.toastr.success('Firma Silindi!', 'Başarılı!', { timeOut: 3000 });
                        this.loadCompanies();
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
        return !this.companyForm.get(field).valid && this.companyForm.get(field).touched;
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
