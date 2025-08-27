import { Component, Input } from '@angular/core';
import { Ticket } from '../models';
import { TitleLimiterPipe } from '../pipes/title-limiter-pipe';

@Component({
  selector: 'app-card',
  imports: [TitleLimiterPipe],
  template: `
    <div id="wrapper" [class]="ticket.type">
      <h4>{{ ticket.title | titleLimiter}}</h4>
      <span>{{ ticket.assignee || 'unassigned' }}</span>
    </div>
  `,
  styles: `
        #wrapper {
            border: solid black 1px;
        }
    `,
})
export class CardComponent {
  @Input({ required: true }) ticket!: Ticket;
}
