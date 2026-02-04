import {Component, inject} from '@angular/core';
import {ExploreService, ThreadPreview} from '../community-pages-service/explore-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-explore',
  imports: [DatePipe],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore {
  private router = inject(Router);
  private ThreadService = inject(ExploreService); //read docs on whether this should be private
  threads = toSignal(this.ThreadService.GetExplorePageThreads(), {initialValue: []})

  navigateToThread(thread : ThreadPreview)
  {
      this.router.navigate(['egeszthread', thread.threadId])
  }
}
