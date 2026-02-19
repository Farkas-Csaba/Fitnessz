import {Component, inject, input, numberAttribute, signal} from '@angular/core';
import {ExploreService} from '../community-pages-service/explore-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';
import {CreateComment} from './create-comment';

@Component({
  selector: 'app-commentlist',
  imports: [
    DatePipe,
    CreateComment
  ],
  templateUrl: './commentlist.html',
  styleUrl: './commentlist.css',
})
export class Commentlist {
  private exploreService = inject(ExploreService);


  threadId = input.required({transform: numberAttribute});
  comments = rxResource(
    {
      params: () => this.threadId(),
      stream: (p) => this.exploreService.getCommentsByThreadId(p.params)
    }
  )

}
