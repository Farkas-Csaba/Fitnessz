import {Component, effect, inject, input, signal} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {ExploreService} from '../../community-pages-service/explore-service';
import {DatePipe} from '@angular/common';
import {Commentlist} from '../../community-comments/commentlist';

@Component({
  selector: 'app-fullthread',
  imports: [
    DatePipe,
    Commentlist
  ],
  templateUrl: './fullthread.html',
  styleUrl: './fullthread.css',
})
export class Fullthread {

  id = input.required<string>();
  service = inject(ExploreService);


  thread = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.service.GetFullThreadByThreadID(+id))
    )
  );
}
