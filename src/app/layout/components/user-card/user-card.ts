import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {

  @Input() username: string = '';
  @Output() toggleAuth: EventEmitter<void> = new EventEmitter();

  get isConnected() {
    return !!this.username;
  }
}
