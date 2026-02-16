import {Component, inject, input, numberAttribute} from '@angular/core';
import {ExploreService} from '../community-pages-service/explore-service';
import {rxResource, toObservable, toSignal} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-commentlist',
  imports: [
    DatePipe
  ],
  templateUrl: './commentlist.html',
  styleUrl: './commentlist.css',
})
export class Commentlist {
  private eploreService = inject(ExploreService);

  threadId = input.required({transform: numberAttribute});
  comments = rxResource(
    {
      params: () => this.threadId(),
      stream: (p) => this.eploreService.getCommentsByThreadId(p.params)
    }
  )
  /*
  comments = toSignal(toObservable(this.threadId).pipe(switchMap(id => this.service.getCommentsByThreadId(+id))
    ),
    { initialValue: [] }
  );*/
}
