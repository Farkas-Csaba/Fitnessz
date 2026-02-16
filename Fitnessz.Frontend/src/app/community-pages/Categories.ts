import {Component, inject, input, numberAttribute} from '@angular/core';
import {ExploreService, ThreadPreview} from '../community-pages-service/explore-service';
import {toSignal, toObservable, rxResource} from '@angular/core/rxjs-interop';
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
   private exploreservice = inject(ExploreService);

  //Something is not right with this in development because of SSR lets keep an eye on it as we move to production
  id = input.required({transform: numberAttribute});
  threads = rxResource({
    params: () => this.id(),
    stream: (p) => this.exploreservice.getThreadsByCategory(p.params)
  })
  /*
  threads = toSignal(
    toObservable(this.id).pipe(
      switchMap(categoryId => this.service.getThreadsByCategory(+categoryId))
    ),
    { initialValue: [] }
  );*/

  goToThread(thread: ThreadPreview)
  {
    this.exploreservice.navigateToThread(thread);
  }
}
