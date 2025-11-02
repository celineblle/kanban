import { Component, inject, signal } from '@angular/core';
import { NavMenu } from '../nav-menu/nav-menu';
import { UserCard } from '../user-card/user-card';
import { AuthService } from '../../../identity/auth.service';
import { LoginFormComponent } from "../../../identity/login-form.component/login-form.component";
import { LoginFormValue } from '../../../identity/models';
import { tap } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [NavMenu, UserCard, LoginFormComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
private authService = inject(AuthService);

isUserAdmin = this.authService.isAdmin;
userName = this.authService.username;

isLoginFormVisible = signal(false);
isLoggingin = signal(false);
loginError = signal<string | null>(null);

onToggleAuth() {
  if(this.authService.isUserConnected()) {
    this.authService.logout();
  } else {
    this.isLoginFormVisible.set(true);
    this.loginError.set(null);
  }
}

onSubmitForm({email, password}: LoginFormValue) {
  this.isLoggingin.set(true);
  this.loginError.set(null);
  this.authService
    .login(email, password)
    .pipe(tap({ finalize: () => this.isLoggingin.set(false) }))
    .subscribe({
      next: () => this.isLoginFormVisible.set(false),
      error: (error) => this.loginError.set(error.message),
    });
}

}
