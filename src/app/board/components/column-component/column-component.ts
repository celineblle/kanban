import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column, Ticket } from '../../models';
import { Card } from '../card/card';

@Component({
  selector: 'app-column-component',
  imports: [Card],
  templateUrl: './column-component.html',
  styleUrl: './column-component.css',
})
export class ColumnComponent {

  @Input({required: true}) column!: Column;
  @Input({required: true}) tickets!: Ticket[];
  @Output() addTicket = new EventEmitter<void>();

}
