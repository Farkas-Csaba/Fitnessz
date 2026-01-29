import {Component, input, output, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ForumComment } from '@shared/interfaces/ForumComment.model';
@Component({
  selector: 'app-comment',
  templateUrl: 'comment.component.html',
  styleUrl: "comment.component.css"

})
export class Comment {
  readonly data = input.required<ForumComment>();
  addupvoteEvent = output<ForumComment>();
  AddUpVote()
  {
    this.addupvoteEvent.emit(this.data());
  }
}
