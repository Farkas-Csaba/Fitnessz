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

@Component({
  selector: 'app-fullthread',
  imports: [
    DatePipe,
    Commentlist
  ],
  templateUrl: './fullthread.html',
  styleUrl: './fullthread.css',
  host: {
    'document:click': 'closeMenu()'
  }
})
export class Fullthread {


  protected id = input.required({transform: numberAttribute});
  private exploreService = inject(ExploreService);
  private snackbar = inject(MatSnackBar);
  private dialog = inject(Dialog);

  protected showMenu = signal(false);
  private authService = inject(AuthService);
  private deleteUpdateService = inject(DeleteUpdateService);
  private router = inject(Router);

  protected isAuthor = computed(() => {
    const user = this.authService.currentUser();
    return user?.username === this.thread.value()?.authorName;

  })

   protected thread = rxResource({
     params: () => this.id(),
     stream: (p) => this.exploreService.getFullThreadByThreadID(p.params)
   });

  toggleMenu(event: Event)
  {
    event.stopPropagation();
    this.showMenu.update(v => !v);
  }

  @HostListener('document:click')
  closeMenu()
  {
    this.showMenu.set(false);
  }

  editThread()
  {
    this.router.navigate(['/posztszerkesztes',this.id()])
  }

  openDeleteModal()
  {
    const dialogRef = this.dialog.open<boolean>(DeleteConfirmCdk, {
      width: '400px',
      backdropClass: 'custom-backdrop'
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        this.deleteUpdateService.deleteThread(this.id()).subscribe(
          {
            next: () => {
              this.snackbar.open('Sikeres törlés! 🗑️', 'Ok', {
                duration: 3000
              })
              this.router.navigate(['']);
            },
            error: () => {
              this.snackbar.open("Sikertelen a törlés, próbálja újra! ❌", 'Bezárás', {
                duration: 3000
              });
            }
          })
      }
    });
  }

}
