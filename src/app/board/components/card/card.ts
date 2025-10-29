import { Component, Input } from '@angular/core';
import { Ticket } from '../../models';
import { TitleLimiterPipe } from '../../pipes/title-limiter-pipe';

@Component({
  selector: 'app-card',
  imports: [TitleLimiterPipe],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
@Input({required: true}) ticket!: Ticket; 
}
