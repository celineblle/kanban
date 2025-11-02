import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginFormValue } from '../models';
import { FormErrorsMessagePipe } from '../../shared/pipes/form-errors-message';

@Component({
  selector: 'app-login-form',
  imports: [FormErrorsMessagePipe, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
private fb = inject(FormBuilder);

form: FormGroup;
isLoading = input(false);
error = input<string | null>(null);
submitForm = output<LoginFormValue>();
close = output<void>();

ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'The email format is incorrect',
};

constructor() {
  this.form = this.fb.group({
    email: ['', [(Validators.required, Validators.email)]],
    password: ['', [Validators.required]],
  });

  effect(() => {
    const isLoading = this.isLoading();
    if(isLoading) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  });

}

onSubmit() {
  if(this.form.invalid || this.isLoading()) {
    return;
  }
  this.submitForm.emit(this.form.value);
}

onCancel() {
  this.form.reset();
  this.close.emit();
}

getControlErrors(controlName: string) {
  const control = this.form.get(controlName);
  return (control?.touched && control.errors) || null;
}

} 