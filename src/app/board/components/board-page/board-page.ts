import { Component } from '@angular/core';
import { ColumnComponent } from '../column-component/column-component';
import { allBoard } from '../../data';
import { Column, Ticket } from '../../models';


@Component({
  selector: 'app-board-page',
  imports: [ColumnComponent],
  templateUrl: './board-page.html',
  styleUrl: './board-page.css',
})
export class BoardPage {

  columns = allBoard.columns;
  tickets = allBoard.tickets;

  constructor() {}

  addTicket(columnId: string) {
    console.log(`add new ticket to column ${columnId} !`)
  }

}
