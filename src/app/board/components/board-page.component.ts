import { Component } from "@angular/core";
import { ColumnComponent } from "./column.component";
import { allBoard } from "../data";


@Component({
    selector: "app-board-page",
    imports: [ColumnComponent],
    template: `<div id="wrapper">
        <div id="columns-wrapper">
            <app-column 
            [column]="columns[0]"
            [tickets]="tickets"
            (addTicket)="addTicket (columns[0].id)"
            />
        </div>
    </div>`,
    styles: [],
})

export class BoardPageComponent {
    columns = allBoard.columns;
    tickets = allBoard.tickets;

    constructor () {}

    addTicket(columnId: string) {
        console.log(`add new ticket to column ${columnId} !`);
    }
}