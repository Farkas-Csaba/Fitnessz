import {Component, inject, input} from '@angular/core';
import {ExploreService, Thread} from '../community-pages-service/explore-service';
import {toSignal, toObservable} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [
    DatePipe
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  ThreadService = inject(ExploreService);

  id = input.required<string>();

  threads = toSignal(
    toObservable(this.id).pipe(
      switchMap(categoryId => this.ThreadService.GetThreadsByCategory(+categoryId))
    ),
    { initialValue: [] }
  );

  openThread(thread: Thread)
  {
    //implement this later, load the thread and comments
  }
}
