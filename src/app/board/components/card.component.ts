import { Component, Input } from '@angular/core';
import { Ticket } from '../models';

@Component({
  selector: 'app-card',
  template: `
    <div id="wrapper" [class]="ticket.type">
      <h4>{{ ticket.title }}</h4>
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
