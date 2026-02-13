import {Component, computed, effect, HostListener, inject, input, signal} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {ExploreService} from '../../community-pages-service/explore-service';
import {DatePipe} from '@angular/common';
import {Commentlist} from '../../community-comments/commentlist';
import {AuthService} from '../../login-pages-service/auth-service';
import {DeleteUpdateService} from '../../community-pages-service/delete-update-service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-fullthread',
  imports: [
    DatePipe,
    Commentlist
  ],
  templateUrl: './fullthread.html',
  styleUrl: './fullthread.css',
})
export class Fullthread {


  id = input.required<string>();
  private exploreService = inject(ExploreService);
  private snackbar = inject(MatSnackBar);

  showMenu = signal(false);
  private authService = inject(AuthService);
  private deleteUpdateService = inject(DeleteUpdateService);
  private router = inject(Router);

  isAuthor = computed(() => {
    const user = this.authService.currentUser();
    return user?.username === this.thread()?.authorName;

  })

  thread = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.exploreService.getFullThreadByThreadID(+id))
    )
  );
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
    this.router.navigate(['/posztszerkesztes',+this.id()])
  }

  deleteThread()
  {
    if (confirm("Biztosan törölni szeretné?"))
    {
      this.deleteUpdateService.deleteThread(+this.id()).subscribe(
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
        }
      )
    }
  }


}
