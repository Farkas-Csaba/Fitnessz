import {Component, inject} from '@angular/core';
import {ExploreService, ThreadPreview} from '../community-pages-service/explore-service';
import {toSignal} from '@angular/core/rxjs-interop';
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
  private service = inject(ExploreService);
  threads = toSignal(this.service.getExplorePageThreads(), {initialValue: []})

  goToThread(thread : ThreadPreview)
  {
    this.service.navigateToThread(thread);
  }
}
