import { Component, EventEmitter, Output, Input } from "@angular/core";


@Component({
    selector: "app-user-card",
    template: `<div>
        <span>{{username}}</span>
        <button
        (click)="toggleAuth.emit()"
        [class]="isConnected ? 'connected' : ''"
        >
    {{isConnected ? 'Log out' : 'Log in'}}
    </button>
    </div>`,
    styles: [],
})

export class UserCardComponent {

    @Input() username: string = '';

    @Output() toggleAuth: EventEmitter<void> = new EventEmitter<void>();

    get isConnected() {
        return !!this.username;
    }
}