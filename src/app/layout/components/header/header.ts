import { Component } from '@angular/core';
import { NavMenu } from '../nav-menu/nav-menu';
import { UserCard } from '../user-card/user-card';

@Component({
  selector: 'app-header',
  imports: [NavMenu, UserCard],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isUserAdmin = false;
  onToggleAuth() {}
}
