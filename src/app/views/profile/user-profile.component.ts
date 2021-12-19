import { UserService } from './../../shared/services/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PasswordValidator } from './password.validator';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  password: any = {};
  newPasswordForm: FormGroup;
  userData: any = {};
  modalReference : NgbModalRef;
  public loading : Boolean = false;
  constructor(
    private _fb : FormBuilder,
    private modalService: NgbModal,
    private userService : UserService,
    private toastr: ToastrService,
    private router: Router
  ) { 
    this.newPasswordForm = this._fb.group({
      email: [''],
      password : ['',[Validators.required, Validators.minLength(6)]],
      newPasswordAgain : ['',[Validators.required,Validators.minLength(6)]]
    },
    {
      validator: PasswordValidator.matchPassword
    })
    
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    //console.log(this.userData );
  }
  openModal(paswordModal){
    this.modalReference = this.modalService.open(paswordModal, {size: 'lg', windowClass: 'modal-adaptive', centered: true});
    this.modalReference.result.then((result) => {   
      }, 
      (reason) => {

      }
    );
  }
  changePassword(){
    if(this.newPasswordForm.valid){
      this.loading = true;
      this.userService.changePassword(this.newPasswordForm.value).subscribe(result => {
        this.toastr.success('Şifre Güncellendi!', 'Başarılı!', { timeOut: 2000 });
        this.modalReference.close();
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
    }else {
      this.validateAllFormFields(this.newPasswordForm)
    }       
  }
  get newPassword() {
    return this.newPasswordForm.get('password');
  }

  get newPasswordAgain() {
    return this.newPasswordForm.get('newPasswordAgain');
  }

  isFieldValidForms(field: string) {
    return !this.newPasswordForm.get(field).valid && this.newPasswordForm.get(field).touched;
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
