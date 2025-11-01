import { Component, inject } from '@angular/core';
import { NavMenu } from '../nav-menu/nav-menu';
import { UserCard } from '../user-card/user-card';
import { AuthService } from '../../../identity/auth.service';

@Component({
  selector: 'app-header',
  imports: [NavMenu, UserCard],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
private authService = inject(AuthService);

isUserAdmin = this.authService.isAdmin;
userName = this.authService.username;

onToggleAuth() {
  if(this.authService.isUserConnected()) {
    this.authService.logout();
  } else {
    this.authService.login('user@test.com', '1234').subscribe();
  }
}
}
