import {Component, computed, HostListener, inject, input, numberAttribute, output, signal} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Dialog} from '@angular/cdk/dialog';
import {DeleteConfirmCdk} from '../../ui-components/delete-confirm-cdk';
import {DeleteUpdateService} from '../../community-pages-service/delete-update-service';
import {AuthService} from '../../login-pages-service/auth-service';


@Component({
  selector: 'app-post-kebab-button',
  imports: [],
  templateUrl: './post-kebab-button.html',
  styleUrl: './post-kebab-button.css',
  host: {
    '(document:click)' : 'closeMenu()'
  }
})
export class PostKebabButton {
  threadId = input.required<number>();
  postId = input.required({transform: numberAttribute});
  authorName = input.required<string>();
  deleted = output<void>();
  editStarted = output<void>();
  private snackbar = inject(MatSnackBar);
  private dialog = inject(Dialog);
  private deleteUpdateService = inject(DeleteUpdateService);
  private authService = inject(AuthService);
  protected showMenu = signal(false);
  protected isAuthor = computed(() => {
    const user = this.authService.currentUser();
    return user?.username === this.authorName();
  })


  toggleMenu(event : Event)
  {
    event.stopPropagation(); //read up on what stopPropogation does
    this.showMenu.update(v => !v);
  }


  closeMenu()
  {
    this.showMenu.set(false);
  }


  editPost()
  {
    this.editStarted.emit();
    this.showMenu.set(false);
  }
  openPostDeleteModal()
  {
    const dialogRef = this.dialog.open<boolean>(DeleteConfirmCdk, {
      width: '400px',
      backdropClass: 'custom-backdrop'
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        this.deleteUpdateService.deletePost(this.threadId(), this.postId()).subscribe({
          next: () => {
            this.snackbar.open('Komment törölve! 🗑️', 'Ok', { duration: 3000 });
            this.deleted.emit();
          },
          error: () => {
            this.snackbar.open("Sikertelen törlés ❌", 'Bezárás', { duration: 3000 });
          }
        });
      }
    });
  }
  openThreadDeleteModal() {
    const dialogRef = this.dialog.open<boolean>(DeleteConfirmCdk, {
      width: '400px',
      backdropClass: 'custom-backdrop'
    });
  }
}
