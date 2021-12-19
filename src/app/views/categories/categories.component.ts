import { CategoryService } from './../../shared/services/category.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
	selector: 'categories',
	templateUrl: './categories.component.html',
	styleUrls: []
})
export class CategoriesComponent implements OnInit {
	categories : any[];
    category: any = {};
    categoryDetail: any = {};
	categoryForm: FormGroup;
    editMode = false;
    newInfoField : CategoryField;
    public minStockWarningColor : string = '#ffffff';
    public maxStockWarningColor : string = '#ffffff';
    public outOfStockWarningColor : string = '#ffffff';
    public loading;
    public userData : any = {};
    modalReference : NgbModalRef;
	constructor(
		private categoryService : CategoryService,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private _fb: FormBuilder, 
        private router: Router,
        private userService : UserService
	) { 
		this.categoryForm = this._fb.group({
            name:['', [Validators.required]],
            topCategoryId:[0],
            minStockCount:[0, [Validators.required]],
            maxStockCount:[0, [Validators.required]],
            description:[''],
            isFifo: false,
            abysTypeCode : [''],
            minStockWarningColor: [''], 
            maxStockWarningColor: [''],
            outOfStockWarningColor: ['']
        });
        
	}

	ngOnInit() {
        this.loadCategories();
        var id = JSON.parse(localStorage.getItem('user')).id;
         this.userService.getUser(id).subscribe(res=>{
             this.userData=res.entity;
         })
	}
	loadCategories(){
        this.loading = true;
        this.categoryService.getCategories().subscribe(result => {
            if(result.meta.isSuccess == true){
                this.categories = result.entities;
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
    }
    getDetail(id,modal){
        this.categoryService.getCategory(id).subscribe(result => {
            this.categoryDetail = result.entity;
            //console.log(this.categoryDetail);
            //console.log(result);
        })
        this.modalService.open(modal, { size:'lg', ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {

            }, (reason) => {
                
            });
    }
	addNewCategory(newCategory){
		this.category = {};
        this.editMode = false;
        this.minStockWarningColor  = '#ffffff';
        this.maxStockWarningColor  = '#ffffff';
        this.outOfStockWarningColor  = '#ffffff';
        this.addCategoryFields();
        this.modalReference = this.modalService.open(newCategory, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
          });

	}
	updateCategory(id, updateCategory){
        this.editMode = true;
        this.categoryService.getCategory(id).subscribe(result => {
            this.category = result.entity;
            this.minStockWarningColor = this.category.minStockWarningColor;
            this.maxStockWarningColor = this.category.maxStockWarningColor;
            this.outOfStockWarningColor = this.category.outOfStockWarningColor;
        })
        this.addCategoryFields();
        this.modalReference = this.modalService.open(updateCategory, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
          });
        
    }
    saveCategory(){
        if(this.categoryForm.valid){
            this.loading = true;
            if(!this.category.id){
                this.categoryService.createCategory(this.category).subscribe(result => {
                    this.loading = false;
                    if(result.meta.isSuccess == true){
                        this.loadCategories();
                        this.modalReference.close();
                        this.toastr.success('Kategori Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
                    }else{
                        this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                        if(result.meta.error === 'authority.error'){

                            this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen tekrar giriş yapınız !', 'Error!', { timeOut: 4000 });
                            localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                        }
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
            }else if(this.category.id){
                this.categoryService.updateCategory(this.category).subscribe(result => {
                    this.loading = false;
                    if(result.meta.isSuccess === true){
                        this.modalReference.close();
                        this.loadCategories();
                        this.toastr.success('Kategori Güncellendi!', 'Başarılı!', { timeOut: 3000 });
                    } else {
                        this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                        if(result.meta.error === 'authority.error'){
                            this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen tekrar giriş yapınız !', 'Error!', { timeOut: 4000 });
                            localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                        }

                    }
                },
                (error: Response) => {
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
            this.validateAllFormFields(this.categoryForm)
        }
    }
    deleteCategory(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then(() => {
                this.loading = true;
                this.categoryService.deleteCategory(id)
                    .subscribe(result => {
                        if(result.meta.isSuccess === true){
                            this.toastr.success('Kategori Silindi!', 'Başarılı!', { timeOut: 3000 });
                            this.loadCategories();
                            this.loading = false;
                        } else {
                            this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                            if(result.meta.error === 'authority.error'){
                                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen tekrar giriş yapınız !', 'Error!', { timeOut: 4000 });
                                localStorage.removeItem('Token');
                                this.router.navigateByUrl('/sessions/signin');
                            }
    
                        }
                    },
                    (error: Response) => {
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
    onChangeColorMinStock(event){
        this.category.minStockWarningColor = event; 
    }
    onChangeColorMaxStock(event){
        this.category.maxStockWarningColor = event;
    }
    onChangeColorOutOfStock(event){
        this.category.outOfStockWarningColor = event;
    }

    addCategoryFields(){
        if(!this.newInfoField){
            this.newInfoField = new CategoryField();
        }
            this.newInfoField.name = '';
            this.newInfoField.valueType = '';
            this.newInfoField.isMandatory = false;
            this.newInfoField.isRequiredOnDefinition = false;
            this.newInfoField.isRequiredOnMove = false;
    }
    
    saveCatField(){
        if(!this.category.mandatoryFields){
            this.category.mandatoryFields = [];
        }
        
        this.category.mandatoryFields.push(this.newInfoField);
        this.newInfoField = new CategoryField();
        this.addCategoryFields();
        //console.log(this.category)
    }
    deleteField(index){
        if(this.category.mandatoryFields.length >= index){
            this.category.mandatoryFields.splice(index,1);
        }
    }

    isFieldValidForms(field: string) {
        return !this.categoryForm.get(field).valid && this.categoryForm.get(field).touched;
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

export class CategoryField {
    name: string;
    valueType: string;
    isMandatory : boolean;
    isRequiredOnDefinition: boolean;
    isRequiredOnMove: boolean;
}
