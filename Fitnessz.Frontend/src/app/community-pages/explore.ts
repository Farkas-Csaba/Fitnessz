import {Component, effect, ElementRef, inject, signal, viewChild} from '@angular/core';
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
  private scrollAnchor = viewChild<ElementRef>('anchor');
  protected threadPreviews = signal<ThreadPreview[]>([]);
  protected currentReference = signal<number>(0);
  protected hasMore = signal<boolean>(true);

  protected readonly currentThreads = rxResource({
    params: () => ({ref: this.currentReference()}),
    stream: ({params}) => this.exploreService.getExplorePageThreads(params.ref)
  });

  constructor() {
    effect(() => {
      const result = this.currentThreads.value();
      console.log('Resource updated:', result);
      if (result && result.data.length > 0) {

        this.threadPreviews.update(prev => {
          const newThreads = result.data.filter(
            nt => !prev.some(pt => pt.threadId === nt.threadId)
          );
          return [...prev, ...newThreads];
        });


        if (result.nextReference === -1) {
          this.hasMore.set(false);
        }
      }
    });
    effect(() => {
      const anchor = this.scrollAnchor()?.nativeElement;
      if (!anchor) return;

      const observer = new IntersectionObserver(([entry]) => {
        // When the anchor enters the viewport AND we aren't already loading
        if (entry.isIntersecting && this.hasMore() && !this.currentThreads.isLoading()) {
          this.LoadMore();
        }
      }, { threshold: 0.1 }); // Trigger when 10% of the anchor is visible

      observer.observe(anchor);

      // Cleanup when the effect re-runs or component is destroyed
      return () => observer.disconnect();
    });
  }
  protected LoadMore() {
    const currentValue = this.currentThreads.value();

    if (currentValue && currentValue.nextReference !== -1) {
      this.currentReference.set(currentValue.nextReference);
    } else {
      this.hasMore.set(false);
    }
  }
  goToThread(thread : ThreadPreview)
  {
    this.exploreService.navigateToThread(thread);
  }
}
