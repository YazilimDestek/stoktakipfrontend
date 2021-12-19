import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EChartOption } from 'echarts';
import { echartStyles } from '../../shared/echart-styles';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
	selector: 'companies',
    templateUrl: './sub-users.component.html',
    styleUrls: []
})
export class SubUserComponent implements OnInit {
	users: any[];
    subUser: any = {};
    subUserForm: FormGroup;
	editMode = false;
	userDetail: any = {};
    public loading;
    submitted = false;
    public mr: NgbModalRef;
    public userData: any = {};
    modalReference : NgbModalRef;

	constructor(
		private userService: UserService,
		private modalService: NgbModal,
        private toastr: ToastrService,
        private _fb: FormBuilder,
        private router: Router,
	) {
        this.subUserForm = this._fb.group({
            name: [''],
            surname: [''],
            email: ['',[Validators.required, Validators.email]],
            username: ['', [Validators.required]],
            password: [''],
            itemAdd : false,
            itemDelete : false,
            itemEdit : false,
            categoryAdd : false,
            categoryDelete : false,
            categoryAEdit : false,
            historyAdd : false,
            historyDelete : false,
            historyEdit : false,
            isAdmin: false,

          });
    }

	ngOnInit() {
        this.loadUsers();
        
        //this.userData = JSON.parse(localStorage.getItem('user')); 
        //console.log("data", this.userData);
	}
	loadUsers() {
        this.userService.getUsers()
            .subscribe(res => {
                this.users = res;
                
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
    reset(){
        this.editMode = false;
        this.subUser = {};
        this.subUser.itemAdd = false;
        this.subUser.itemDelete = false;
        this.subUser.itemEdit = false;
        this.subUser.categoryAdd = false;
        this.subUser.categoryDelete = false;
        this.subUser.categoryAEdit = false;
        this.subUser.historyAdd = false;
        this.subUser.historyDelete = false;
        this.subUser.historyEdit = false;
        this.subUser.isAdmin = false;
        this.subUser.isActive = true;
    }
     addNewUser(newUserModal){
        this.reset();
        this.modalReference = this.modalService.open(newUserModal, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
          }, (reason) => {
        });
    }
    save(){
        if(this.subUserForm.valid){
            if(!this.subUser.id){
                this.userService.createUser(this.subUser).subscribe(result => {
                    this.loading = false;
                    if(result.meta.isSuccess == true){
                        this.loadUsers();
                        this.modalReference.close();
                        
                        this.toastr.success('Kullanıcı Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
                    }else{
                        this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                    }
                    
                },(error: Response) => {
                    this.loading = false;
                    if(error.status === 401){
                        this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                        localStorage.removeItem('Token');
                        this.router.navigateByUrl('/sessions/signin');
                    }
                    else if(error.status==400){
                        this.toastr.error(error['_body'], 'HATA!', { timeOut: 3000 });
                    }
                    else {
                        this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                    }
                }); 
            }else if(this.subUser.id){
                this.userService.updateUser(this.subUser).subscribe(result => {
                        this.loading = false;
                        this.loadUsers();
                        this.modalReference.close();
                        this.toastr.success('Kullanıcı Bilgileri Güncellendi!', 'Başarılı!', { timeOut: 3000 });
                    },(error: Response) => {
                        this.loading = false;
                        if(error.status === 401){
                            this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                            localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                        }
                        else if(error.status===400){
                            this.toastr.error(error['_body'], 'HATA!', { timeOut: 3000 });
                        }
                        else {
                            this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                        }
                    });
            }
        }else{
            this.validateAllFormFields(this.subUserForm)
        }
    }
    updateUser(id, modal){
        this.userService.getUser(id).subscribe(result => {
            if(result.meta.isSuccess == true){
                this.subUser = result.entity;
                this.subUser.password = 'null';
                this.subUserForm.controls['password'].patchValue('');
                this.loading = false;
                //console.log(this.subUser);
            }else{
                this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
            }
            
        },(error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            }
          
            else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        });
        this.modalReference = this.modalService.open(modal, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
          }, (reason) => {
        });
        this.editMode = true;
    }
	deleteUser(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.loading = true;
                this.userService.deleteUser(id)
                    .subscribe(res => {
                        this.toastr.success('Kullanıcı Silindi!', 'Başarılı!', { timeOut: 3000 });
                        this.loadUsers();
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
        return !this.subUserForm.get(field).valid && this.subUserForm.get(field).touched;
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
