import {Component, inject, input, numberAttribute, signal} from '@angular/core';
import {ExploreService} from '../community-pages-service/explore-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';
import {CreateComment} from './create-comment';
import {PostKebabButton} from '../Icons/kebabs/post-kebab-button';
import {DeleteUpdateService, updatePostDto} from '../community-pages-service/delete-update-service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-commentlist',
  imports: [
    DatePipe,
    CreateComment,
    PostKebabButton
  ],
  templateUrl: './commentlist.html',
  styleUrl: './commentlist.css',
})
export class Commentlist {
  private exploreService = inject(ExploreService);
  private deleteUpdateService = inject(DeleteUpdateService);
  private snackbar = inject(MatSnackBar);
  protected isEditing = signal(false);

  protected editingPostId = signal<number | null>(null);
  startEdit(postId: number)
  {
    this.editingPostId.set(postId);
  }
  cancelEdit()
  {
    this.editingPostId.set(null);
  }
  saveEdit(threadId : number, postId : number, textValue : string)
  {
    this.isEditing.set(true);
    const payload : updatePostDto = {
      content : textValue
    }
    this.deleteUpdateService.updatePost(threadId, postId, payload).subscribe({
      next: () =>
      {
        this.snackbar.open('Válasz frissítve!✅ ', 'OK', { duration: 3000 });
        this.editingPostId.set(null);
        this.comments.reload();
      },
      error: ()=>
      {
        this.snackbar.open("Komment szerkesztése sikertelen, kérem próbálja újra!❌", "bezárás", {
          duration: 3000
        })
        this.isEditing.set(false);
      }

    })
  }
  threadId = input.required({transform: numberAttribute});
  comments = rxResource(
    {
      params: () => this.threadId(),
      stream: (p) => this.exploreService.getCommentsByThreadId(p.params)
    }
  )

  protected readonly Object = Object;
}
