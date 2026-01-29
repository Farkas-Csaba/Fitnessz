import {Injectable, signal} from '@angular/core';
import { ForumComment} from '@shared/interfaces/ForumComment.model';

@Injectable({
  providedIn: 'root',
})
export class Forum {
  readonly comments= signal<ForumComment[]>([
    { id: 1, author: 'DevDude', content: 'Focus on Signals!', timeStamp: '2h ago', upvotes: 12 },
    { id: 2, author: 'NgExpert', content: 'Check out the new @for syntax.', timeStamp: '1h ago', upvotes: 45 },
    { id: 3, author: 'Starter101', content: 'Thanks, this helps!', timeStamp: '10m ago', upvotes: 2 }

  ]);
  AddUpvote(commentData: ForumComment)
  {
    this.comments.update((oldComments) => {
      return oldComments.map((c) => {
        // If the ID matches the one we clicked, return a new object with +1 upvote
        if (c.id === commentData.id) {
          return { ...c, upvotes: c.upvotes + 1 };
        }
        // Otherwise, return the comment as it was
        return c;
      });
    });
  }

}
