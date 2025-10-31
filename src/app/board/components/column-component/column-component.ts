import { Component, input, output } from '@angular/core';
import { Column, DragDropPayload, Ticket } from '../../models';
import { Card } from '../card/card';
import { Draggable } from "../../directives/draggable";
import { Droppable } from "../../directives/droppable";

@Component({
  selector: 'app-column-component',
  imports: [Card, Draggable, Droppable],
  templateUrl: './column-component.html',
  styleUrl: './column-component.css',
})
export class ColumnComponent {

  column = input.required<Column>();
  tickets = input.required<Ticket[]>();
  addTicket = output<void>();
  reorderTicket = output<DragDropPayload>();
}
