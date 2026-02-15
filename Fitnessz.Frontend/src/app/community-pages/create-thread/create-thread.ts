import {Component, effect, inject, signal} from '@angular/core';
import {CreateService, ThreadObject} from '../../community-pages-service/create-service';
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ExploreService} from '../../community-pages-service/explore-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {rxResource} from '@angular/core/rxjs-interop';


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
export class CreateThread{
  private createService = inject(CreateService);
  private exploreService = inject(ExploreService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  protected categoriesResource = rxResource({
    stream: () => this.exploreService.getCategories()
  }) // holds categories from api call
  protected isSubmitting = signal(false);

  constructor() {
    effect((onCleanup) => {
      const error = this.categoriesResource.error();

      if (error) {
        const snackbarRef = this.snackbar.open('Hiba történt a kategóriák betöltésekor! ❌', 'bezárás', {
          duration: 3000
        });


        onCleanup(() => {
          snackbarRef.dismiss();
        });
      }
    });
  }


  threadForm = this.fb.group(
    {
      CategoryId: ['', [Validators.required]],
      Title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      Content: ['', [Validators.maxLength(2000)]]
    }
  )
  /* NOT NEEDED because of rxResource
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
          this.snackbar.open('Hibe történt a kategóriák betöltésekor! ❌', 'bezárás', {
            duration: 3000
          });
        }
      });
  }
  */

  SubmitThread()
  {
    if (this.threadForm.valid)
    {
      this.isSubmitting.set(true);
      const rawValue = this.threadForm.getRawValue();
      const threadData: ThreadObject = {
        title: rawValue.Title!,
        content: rawValue.Content,
        categoryId: Number(rawValue.CategoryId!)
      };
      this.createService.createThread(threadData).subscribe({
        next: (response) => {
          this.snackbar.open('Sikeres feltöltés! ✅', 'Ok', {
            duration: 3000
          })
          this.router.navigate(['']);
        },
        error: () => {
          this.snackbar.open('Hiba történt posztoláskor! ❌', 'Bezár', {
            duration: 3000
          });
          this.isSubmitting.set(false);
        }
      });
    }
    else {
      this.threadForm.markAllAsTouched();
    }
  }
  CancelCreation()
  {
    this.router.navigate(['']);
  }
}
