import {Component, inject, input} from '@angular/core';
import {ExploreService} from '../community-pages-service/explore-service';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
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
  private service = inject(ExploreService);

  threadId = input.required<string>();

  comments = toSignal(toObservable(this.threadId).pipe(switchMap(id => this.service.getCommentsByThreadId(+id))
    ),
    { initialValue: [] }
  );
}
