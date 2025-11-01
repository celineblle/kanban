import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {map} from 'rxjs';
import { CreateTicketResponse, DragDropLocation, GetBoardResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
private http = inject(HttpClient);
  
  constructor() {}

  getBoard() {
    return this.http
      .get<GetBoardResponse>('/api/board')
      .pipe(map((r) => r.board));
  }

  reorderTicket(from: DragDropLocation, to: DragDropLocation) {
    return this.http
      .patch<GetBoardResponse>(
        `/api/board/ticket/reorder/${from.ticketId}`,
        {
          to,
        }
      )
      .pipe(map((r) => r.board));
  }

  createTicket(columnId: string) {
    return this.http.post<CreateTicketResponse>(
      `/api/board/ticket/${columnId}`,
      {
        ticket: {
          description: '',
          title: 'New task', 
          type: 'task',
        },
      }
    );
  }

}
