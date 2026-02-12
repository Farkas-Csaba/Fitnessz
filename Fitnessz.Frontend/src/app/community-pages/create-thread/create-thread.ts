import {Component, inject, OnInit, signal} from '@angular/core';
import {CreateService, ThreadObject} from '../../community-pages-service/create-service';
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ExploreService} from '../../community-pages-service/explore-service';

export interface Category { //interface for type safety
  categoryId: number,
  name: string
}

@Component({
  selector: 'app-create-thread',
  imports: [ReactiveFormsModule],
  templateUrl: './create-thread.html',
  styleUrl: './create-thread.css',
})
export class CreateThread implements OnInit{
  private createService = inject(CreateService);
  private exploreService = inject(ExploreService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  categories = signal<Category[]>([]); // holds categories from api call
  isLoading = signal(false);

  threadForm = this.fb.group(
    {
      CategoryId: ['', [Validators.required]],
      Title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      Content: ['', [Validators.maxLength(2000)]]
    }
  )

  ngOnInit() {
    this.loadCategories();
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

  SubmitThread()
  {
    if (this.threadForm.valid)
    {
      this.isLoading.set(true);

      const threadData: ThreadObject = {
        title: this.threadForm.value.Title!,
        content: this.threadForm.value.Content,
        categoryId: Number(this.threadForm.value.CategoryId!)
      };
      this.createService.createThread(threadData).subscribe({
        next: (response) => {
          console.log('Thread created!', response); //look into this i heard side effects such as logging should be in seperate effect
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('API Error:', err);
          alert('Nem sikerült a posztolás. Próbáld újra!');
          this.isLoading.set(false);
        }
      });
    }
    else {
      this.threadForm.markAllAsTouched();
    }
  }
  CancelCreation()
  {
    this.router.navigate(['']); //maybe '/'
  }
}
