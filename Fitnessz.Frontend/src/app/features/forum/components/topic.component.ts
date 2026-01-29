import {Component, inject, signal} from '@angular/core';
import {Comment} from './comment.component';
import {Forum} from '@features/forum/services/forum.service';
import { ForumComment } from '@shared/interfaces/ForumComment.model';


@Component({
  selector: 'app-topic-page',
  imports: [Comment],
  templateUrl:'topic.component.html'
})

export class TopicPage{
  private forumService = inject(Forum)
  comments = this.forumService.comments
  UpdateDb(commentData: ForumComment)
  {
    this.forumService.AddUpvote(commentData);
  }


}

