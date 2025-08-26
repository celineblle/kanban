import { Component } from "@angular/core";
import { UserCardComponent } from "./user-card.component";
import { NavMenuComponent } from "./nav-menu.component";


@Component({
    selector: "app-header",
    imports: [UserCardComponent, NavMenuComponent],
    template: `<div>
        <app-nav-menu [isAdmin]="isUserAdmin" />
        <app-user-card (toggleAuth)="onToggleAuth()" />
    </div>`,
    styles: [],
})

export class HeaderComponent {

    isUserAdmin = false;
    onToggleAuth() {}


}