import {Component, effect, inject, input, numberAttribute, OnInit, signal} from '@angular/core';
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {ExploreService} from '../../community-pages-service/explore-service';
import {Category, CreateThread} from '../create-thread/create-thread';
import {DeleteUpdateService} from '../../community-pages-service/delete-update-service';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-thread',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-thread.html',
  styleUrl: './edit-thread.css',
})
export class EditThread {
  private fb = inject(FormBuilder);
  private exploreService = inject(ExploreService);
  private deleteUpdateService = inject(DeleteUpdateService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  id = input.required({transform: numberAttribute});
  protected isSubmitting = signal<boolean>(false);

  protected categories = rxResource({
    stream: () => this.exploreService.getCategories()
  })
  protected threadData = rxResource({
    params: () => this.id(),
    stream: (p) => this.exploreService.getFullThreadByThreadID(p.params)
  })

  constructor() {
    effect((onCleanup) => {
      if (this.categories.error()) {
        const snackbarRef = this.snackbar.open('Hiba a kategóriák betöltésekor! ❌', 'Bezár', {
          duration: 3000
        });

        onCleanup(() => {
          snackbarRef.dismiss()
        })
      }
    });
    effect((onCleanup) => {
      if (this.threadData.error()) {
        const snackbarRef = this.snackbar.open('Hiba a poszt adatainak lekérésekor! ❌', 'Bezár', {
          duration: 3000
        });

        onCleanup(() => {
          snackbarRef.dismiss()
        })
      }
    });
    effect(() => {
      const data = this.threadData.value();
      if (data) {
        this.threadForm.patchValue({
          CategoryId: data.categoryId.toString(),
          Title: data.title,
          Content: data.content
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

  updateThread() {
    if (this.threadForm.valid) {
      this.isSubmitting.set(true);

      const rawValue = this.threadForm.getRawValue();
      const updatedData = {
        title: rawValue.Title!,
        content: rawValue.Content!,
        categoryId: Number(rawValue.CategoryId!)
      };


      this.deleteUpdateService.updateThread(updatedData,Number(this.id())).subscribe({
        next: () => {
          this.snackbar.open('Sikeres szerkesztés! ✅', 'Ok', {
            duration: 3000
          })
          this.router.navigate(['egeszthread', this.id()]);
        },
        error: () => {
          this.isSubmitting.set(false);
          this.snackbar.open('Hiba történt mentéskor! ❌', 'Bezár',{
            duration: 3000
          });
        }
      });
    }
  }
  CancelCreation()
  {
    this.router.navigate(['egeszthread', this.id()]);
  }
}
