import {Component, inject, input} from '@angular/core';
import {ExploreService, ThreadPreview} from '../community-pages-service/explore-service';
import {toSignal, toObservable} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {DatePipe} from '@angular/common';
import {CreateThreadButton} from '../Icons/create-thread-button';

@Component({
  selector: 'app-categories',
  imports: [
    DatePipe,
    CreateThreadButton
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
   private service = inject(ExploreService);

  //Something is not right with this in development because of SSR lets keep an eye on it as we move to production
  id = input.required<string>();
  threads = toSignal(
    toObservable(this.id).pipe(
      switchMap(categoryId => this.service.GetThreadsByCategory(+categoryId))
    ),
    { initialValue: [] }
  );

  goToThread(thread: ThreadPreview)
  {
    this.service.NavigateToThread(thread);
  }
}
