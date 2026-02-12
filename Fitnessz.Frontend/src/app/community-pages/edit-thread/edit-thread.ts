import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {ExploreService} from '../../community-pages-service/explore-service';
import {Category, CreateThread} from '../create-thread/create-thread';
import {DeleteUpdateService} from '../../community-pages-service/delete-update-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-thread',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-thread.html',
  styleUrl: './edit-thread.css',
})
export class EditThread implements OnInit {
  private fb = inject(FormBuilder);
  private exploreService = inject(ExploreService);
  private deleteUpdateService = inject(DeleteUpdateService);
  private router = inject(Router);

  id = input.required<string>();
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);

  threadForm = this.fb.group(
    {
      CategoryId: ['', [Validators.required]],
      Title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      Content: ['', [Validators.maxLength(2000)]]
    }
  )
  ngOnInit() {
    this.loadCategories();
    this.loadThreadData();
  }


  public loadCategories() {
    this.exploreService.getCategories().subscribe(
      {
        next: (data) =>
        {
          this.categories.set(data);
        },
        error: (err) => {
          console.error('Failed to load categories', err);
          alert('Nem sikerült betölteni a kategóriákat');
        }
      });
  }
  loadThreadData() {
    const threadId = Number(this.id());
    // We use the same service you likely use for the detail view
    this.exploreService.getFullThreadByThreadID(threadId).subscribe({
      next: (thread) => {

        this.threadForm.patchValue({
          CategoryId: thread.categoryId.toString(),
          Title: thread.title,
          Content: thread.content
        });
      },
      error: () => alert('Hiba a poszt adatainak lekérésekor')
    });
  }

  updateThread() {
    if (this.threadForm.valid) {
      this.isLoading.set(true);

      const updatedData = {
        title: this.threadForm.value.Title!,
        content: this.threadForm.value.Content!,
        categoryId: Number(this.threadForm.value.CategoryId!)
      };


      this.deleteUpdateService.updateThread(updatedData,Number(this.id())).subscribe({
        next: () => this.router.navigate(['egeszthread', this.id()]),
        error: () => {
          this.isLoading.set(false);
          alert('Szerkesztés sikertelen!');
        }
      });
    }
  }
  CancelCreation()
  {
    this.router.navigate(['egeszthread', this.id()]);
  }
}
