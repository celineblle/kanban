import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Column, Ticket } from "../models";
import { CardComponent } from "./card.component";


@Component({
    selector: "app-column",
    imports: [CardComponent],
    template: `<div id="wrapper">
        <h4>{{column.title}}</h4>
        <div id="list">
            <app-card [ticket]="tickets[0]" />
        </div>
        <button (click)="addTicket.emit()" >Add Ticket</button>
    </div>`,
    styles: `#wrapper {
        border: solid blue 1px;
    }`,
})

export class ColumnComponent {
    @Input({required: true}) column!: Column;
    @Input({required: true}) tickets!: Ticket[];
    @Output() addTicket = new EventEmitter<void>();
}