import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})
export class SigninComponent implements OnInit {
    error:string;
    loading: boolean;
    loadingText: string;
    signinForm: FormGroup;
    constructor(
        private modalService: NgbModal,
        private toastr: ToastrService,
        private store: LocalStoreService,
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.auth.authenticated = true;
        if(this.store.getItem("Token")){
            
            this.router.navigateByUrl('/dashboard');
        }

        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                this.loadingText = 'Yükleniyor...';

                this.loading = true;
            }
            if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                this.loading = false;
            }
        });

        this.signinForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            remember: false
        });
    }

    signin(modal) {
        this.loading = true;
        this.loadingText = 'Giriş yapılıyor...';
        this.auth.signin(this.signinForm.value)
            .subscribe(res => {
                if(res.meta.isSuccess == true){
                    this.loading = false;
                    this.auth.authenticated = true;
                    this.store.setItem('Token', res.entity.value);
                    localStorage.setItem('user', JSON.stringify(res.entity.user))
                    this.router.navigateByUrl('/dashboard');
                }else{
                    if(res.meta.errorMessage){
                        this.error = res.meta.errorMessage;
                    }
                    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
                        .result.then((result) => {
                            this.loading = false;
                        }, (reason) => {
                        });
                }
            });
    }

}
