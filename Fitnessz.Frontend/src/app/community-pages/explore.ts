import {Component, inject} from '@angular/core';
import {ExploreService, ThreadPreview} from '../community-pages-service/explore-service';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {CreateThreadButton} from '../Icons/create-thread-button';

@Component({
  selector: 'app-explore',
  imports: [DatePipe, CreateThreadButton],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore {
  private router = inject(Router);
  private exploreService = inject(ExploreService);
  protected threads = rxResource({
    stream: () => this.exploreService.getExplorePageThreads()
  });

  goToThread(thread : ThreadPreview)
  {
    this.exploreService.navigateToThread(thread);
  }
}
