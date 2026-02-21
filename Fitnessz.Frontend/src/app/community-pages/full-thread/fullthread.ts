import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  signal,
  resource,
  numberAttribute
} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';

import {ExploreService, Thread} from '../../community-pages-service/explore-service';
import {DatePipe} from '@angular/common';
import {Commentlist} from '../../community-comments/commentlist';
import {AuthService} from '../../login-pages-service/auth-service';
import {DeleteUpdateService} from '../../community-pages-service/delete-update-service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Dialog} from '@angular/cdk/dialog';
import {DeleteConfirmCdk} from '../../ui-components/delete-confirm-cdk';
import {threadId} from 'node:worker_threads';
import {ThreadKebabButton} from '../../Icons/kebabs/thread-kebab-button';

@Component({
  selector: 'app-fullthread',
  imports: [
    DatePipe,
    Commentlist,
    ThreadKebabButton
  ],
  templateUrl: './fullthread.html',
  styleUrl: './fullthread.css',

})
export class Fullthread {


  protected id = input.required({transform: numberAttribute});
  private exploreService = inject(ExploreService);
  private authService = inject(AuthService);

  protected isAuthor = computed(() => {
    const user = this.authService.currentUser();
    return user?.username === this.thread.value()?.authorName;

  })

   protected thread = rxResource({
     params: () => this.id(),
     stream: (p) => this.exploreService.getFullThreadByThreadID(p.params)
   });



}
