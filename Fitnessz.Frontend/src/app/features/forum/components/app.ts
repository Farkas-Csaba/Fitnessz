import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {Comment} from '@features/forum/components/comment.component';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template:'<nav><button routerLink="/forum">Go to forum</button></nav> <hr/> <router-outlet/>'
})
export class App {

}
