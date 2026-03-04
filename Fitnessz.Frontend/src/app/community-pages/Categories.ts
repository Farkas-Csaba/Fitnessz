import { Component, effect, ElementRef, inject, input, numberAttribute, signal, viewChild } from '@angular/core';
import { ExploreService, ThreadPreview } from '../community-pages-service/explore-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { CreateThreadButton } from '../Icons/create-thread-button';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [DatePipe, CreateThreadButton],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private exploreService = inject(ExploreService);
  private scrollAnchor = viewChild<ElementRef>('anchor');

  // Master list of threads for the current category
  protected threadPreviews = signal<ThreadPreview[]>([]);
  protected currentReference = signal<number>(0);
  protected hasMore = signal<boolean>(true);

  // Input from the router (e.g., /categories/5)
  id = input.required({ transform: numberAttribute });

  // The Resource now tracks BOTH the ID and the Reference
  protected readonly threadsResource = rxResource({
    params: () => ({
      categoryId: this.id(),
      ref: this.currentReference()
    }),
    stream: ({ params }) => this.exploreService.getThreadsByCategory(params.categoryId, params.ref)
  });

  constructor() {
    // EFFECT 1: Reset state when Category ID changes
    effect(() => {
      this.id(); // Track the ID
      // Reset everything for the new category
      this.threadPreviews.set([]);
      this.currentReference.set(0);
      this.hasMore.set(true);
    });

    // EFFECT 2: Accumulate data when the resource fetches new items
    effect(() => {
      const result = this.threadsResource.value();

      // result.data matches your Backend DTO 'data' property
      if (result && result.data) {
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

    // EFFECT 3: Infinite Scroll Intersection Observer
    effect(() => {
      const anchor = this.scrollAnchor()?.nativeElement;
      if (!anchor) return;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && this.hasMore() && !this.threadsResource.isLoading()) {
          this.LoadMore();
        }
      }, { threshold: 0.1 });

      observer.observe(anchor);
      return () => observer.disconnect();
    });
  }

  protected LoadMore() {
    const currentValue = this.threadsResource.value();
    if (currentValue && currentValue.nextReference !== -1) {
      this.currentReference.set(currentValue.nextReference);
    } else {
      this.hasMore.set(false);
    }
  }

  goToThread(thread: ThreadPreview) {
    this.exploreService.navigateToThread(thread);
  }
}
