import {Component, inject} from '@angular/core';
import {ExploreService, Thread} from '../community-pages-service/explore-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-explore',
  imports: [DatePipe],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore {
  ThreadService = inject(ExploreService); //read docs on whether this should be private
  threads = toSignal(this.ThreadService.GetExplorePageThreads(), {initialValue: []})

  openThread(thread : Thread)
  {
    //load the full content of thread
  }
}
