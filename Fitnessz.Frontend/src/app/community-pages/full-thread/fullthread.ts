import {Component, computed, effect, HostListener, inject, input, signal} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {ExploreService} from '../../community-pages-service/explore-service';
import {DatePipe} from '@angular/common';
import {Commentlist} from '../../community-comments/commentlist';
import {AuthService} from '../../login-pages-service/auth-service';
import {DeleteUpdateService} from '../../community-pages-service/delete-update-service';
import {Router} from '@angular/router';

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
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Törlési hiba:', err);
            alert("Nem sikerült a törlés, próbálja újra");
          }
        }
      )
    }
  }


}
