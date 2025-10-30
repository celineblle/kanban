import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input({required: true}) column!: Column;
  @Input({required: true}) tickets!: Ticket[];
  @Output() addTicket = new EventEmitter<void>();
  @Output() reorderTicket = new EventEmitter<DragDropPayload>();
}
