import {Component, HostListener, inject, input, signal} from '@angular/core';
import {DeleteConfirmCdk} from '../../ui-components/delete-confirm-cdk';
import {Router} from '@angular/router';
import {Dialog} from '@angular/cdk/dialog';
import {DeleteUpdateService} from '../../community-pages-service/delete-update-service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-thread-kebab-button',
  imports: [],
  templateUrl: './thread-kebab-button.html',
  styleUrl: './thread-kebab-button.css',
  host: {
    '(document:click)' : 'closeMenu()'
  }

})
export class ThreadKebabButton {
  id = input.required<number>();

  protected dialog = inject(Dialog);
  protected showMenu = signal(false);
  private router = inject(Router);
  private deleteUpdateService = inject(DeleteUpdateService);
  protected snackbar = inject(MatSnackBar);

  toggleMenu(event: Event)
  {
    event.stopPropagation();
    this.showMenu.update(v => !v);
  }

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
