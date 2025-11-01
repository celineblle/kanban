import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {

  username = input<string>('');
  toggleAuth = output<void>();
  isConnected = computed(() => !!this.username());
}
