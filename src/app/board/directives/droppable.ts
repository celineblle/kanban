import { ContentChild, Directive, HostListener, input, output, QueryList } from '@angular/core';
import { REORDER_DROP_DATATYPE } from '../constants';
import { Draggable } from './draggable';
import { DragDropPayload } from '../models';

@Directive({
  selector: '[appDroppable]'
})
export class Droppable {
  columnId = input.required<string>();
  dropItem = output<DragDropPayload>();
  @ContentChild(Draggable)
  draggables!: QueryList<Draggable>;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const dt = event.dataTransfer;
    if(!dt?.types.includes(REORDER_DROP_DATATYPE)) {
      return;
    }
    const data = dt.getData(REORDER_DROP_DATATYPE);
    let destination = {
      id: '',
      columnId: this.columnId(),
    };
    this.draggables.forEach((draggable) => {
      if (draggable.hasDragEntered) {
        destination = draggable.appDraggableData();
      }
      draggable.reset();
    });
    try {
      const parsedData = JSON.parse(data);
      this.dropItem.emit([
        {
          columnId: parsedData.columnId,
          ticketId: parsedData.id,
        },
        {
          columnId: destination.columnId,
          ticketId: destination.id,
        }
      ]);
      console.log(parsedData);
    } catch (err: unknown) {
      return;
    }
  }
}
