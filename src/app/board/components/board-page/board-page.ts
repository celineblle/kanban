import { Component, computed, effect, inject, signal } from '@angular/core';
import { ColumnComponent } from '../column-component/column-component';
import { Column, DragDropLocation, Ticket } from '../../models';
import { BoardService } from '../../data/board.service';
import { tap } from 'rxjs';
import { AuthService } from '../../../identity/auth.service';

@Component({
  selector: 'app-board-page',
  imports: [ColumnComponent],
  templateUrl: './board-page.html',
  styleUrl: './board-page.css',
})
export class BoardPage {
  private boardService = inject(BoardService);
  private authService = inject(AuthService);
  private ticketList = signal<Ticket[]>([]);

  columns = signal<Column[]>([]);
  ticketByColumnId = computed(() => {
    const columns = this.columns();
    const tickets = this.ticketList();
    return this.getTicketsMap(columns, tickets);
  });
  isLoadingBoard = signal<boolean>(false);
  hasError = signal<boolean>(false);
  isUserConnected = this.authService.isUserConnected;


  constructor() {
    effect(() => {
      const isConnected = this.authService.isUserConnected();
      if(isConnected) {
        this.loadBoard();
      }
    });
    
    this.isLoadingBoard.set(true);
    this.hasError.set(false);
  }


  addTicket(columnId: string) {
    this.boardService.createTicket(columnId).subscribe({
      next: ({createdTicket}) => {
        this.ticketList.update((list) => {
          const newList = [...list, createdTicket];
          return newList;
        });
        this.hasError.set(false);
      },
      error: (err) => this.hasError.set(true),
    });
  }

  onReorderTicket([from, to]: [DragDropLocation, DragDropLocation]) {
    this.localReorderTicket([from, to]);
    this.boardService.reorderTicket(from, to).subscribe({
      next: ({tickets}) => {
        this.ticketList.set(tickets);
      },
    });


    function shift(
      arr: Ticket[], 
      isUp: boolean,
      fromId: number = 0, 
      toId: number = arr.length
    ) {
      for (let ticket of arr) {
        if (ticket.order >= fromId && ticket.order <= toId) {
          ticket.order += isUp ? 1 : -1;
        }
      }
    }
  }

  private loadBoard() {
    this.isLoadingBoard.set(true);
    this.hasError.set(false);
    this.boardService
      .getBoard()
      .pipe(
        tap({finalize: () => this.isLoadingBoard.set(false)})
      )
      .subscribe({
        next: ({columns, tickets}) => {
          this.columns.set(columns);
          this.ticketList.set(tickets);
          this.hasError.set(false);
        },
        error: (err) => this.hasError.set(true),
      });
  }

private localReorderTicket([from, to]: [DragDropLocation, DragDropLocation]) {
  function shift(arr: Ticket[], isUp: boolean, fromId: number = 0, toId: number = arr.length) {
    for( let ticket of arr) {
      if(ticket.order >= fromId && ticket.order <= toId) {
        ticket.order += isUp ? 1 : -1;
      }
    }
  }

  const ticketsMap = this.ticketByColumnId();
  const ticketList = this.ticketList();

  const fromTicket = ticketsMap[from.columnId].find((t) => t.id === from.ticketId);
  const toTicket = ticketsMap[to.columnId].find((t) => t.id === to.ticketId);
  const newOrder = toTicket?.order || 1;

  if(!fromTicket) return;
  if(from.columnId !== to.columnId) {
    shift(ticketsMap[from.columnId], false, fromTicket.order);
    shift(ticketsMap[to.columnId], true, newOrder);
  } else {
    const isGoingUp = fromTicket.order > newOrder;
    shift(
      ticketsMap[to.columnId],
      isGoingUp,
      Math.min(fromTicket.order, newOrder),
      Math.max(fromTicket.order, newOrder),
    );
  }

  fromTicket.order = newOrder;
  fromTicket.columnId = to.columnId;

  this.ticketList.set([...ticketList]);
}

  private getTicketsMap (columns: Column[], tickets: Ticket[]) {
    const draftMap: Record<string, Ticket[]> = {};

    for (let ticket of tickets) {
      if(!draftMap[ticket.columnId]) {
        draftMap[ticket.columnId] = [];
      }
      const columnId = ticket.columnId;
      draftMap[columnId].push(ticket);
    }

    for (let { id } of columns) {
      const currentColumn = draftMap[id];
      
      if(!currentColumn) {
        draftMap[id] = [];
      } else {
        currentColumn.sort((a, b) => a.order - b.order);
      }
    } 
    return draftMap
  }

}
