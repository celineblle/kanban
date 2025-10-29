import { Component, signal } from '@angular/core';
import { Header } from './layout/components/header/header';
import { BoardPage } from './board/components/board-page/board-page';

@Component({
  selector: 'app-root',
  imports: [Header, BoardPage],
  template: `<div>
    <app-header />
    <app-board-page />
  </div>`,
})
export class App {
}
