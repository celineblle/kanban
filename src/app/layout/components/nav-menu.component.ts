import { Component, Input } from "@angular/core";


@Component({
    selector: "app-nav-menu",
    template: `<div>
    <a >Board</a>
    <a [class]="isAdmin ? '' : 'disabled'" >Admin</a>
</div>`,
    styles: [],
})

export class NavMenuComponent {
    @Input() isAdmin: boolean = false;
}