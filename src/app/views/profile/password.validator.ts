import { AbstractControl } from "@angular/forms";

export class PasswordValidator {
   

    static matchPassword(control: AbstractControl) {
        let newPassword = control.get('password');
        let confirmPassword = control.get('newPasswordAgain');
        if (newPassword.value !== confirmPassword.value)
            return { matchPassword: true }
        else
            return null;
    }

}