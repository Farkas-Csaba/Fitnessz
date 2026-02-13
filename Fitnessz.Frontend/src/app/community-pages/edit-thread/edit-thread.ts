import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {ExploreService} from '../../community-pages-service/explore-service';
import {Category, CreateThread} from '../create-thread/create-thread';
import {DeleteUpdateService} from '../../community-pages-service/delete-update-service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  private snackbar = inject(MatSnackBar);

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
          this.snackbar.open('Hiba a kategóriák betöltésekor! ❌', 'Bezár', {
            duration: 3000
          }); //new snack
        }
      });
  }
  loadThreadData() {
    const threadId = Number(this.id());

    this.exploreService.getFullThreadByThreadID(threadId).subscribe({
      next: (thread) => {

        this.threadForm.patchValue({
          CategoryId: thread.categoryId.toString(),
          Title: thread.title,
          Content: thread.content
        });
      },
      error: () => this.snackbar.open('Hiba a poszt adatainak lekérésekor! ❌', 'Bezár', {
        duration: 3000
      }) //new snack
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
        next: () => {
          this.snackbar.open('Sikeres szerkesztés! ✅', 'Ok', {
            duration: 3000
          })
          this.router.navigate(['egeszthread', this.id()]);
        },
        error: () => {
          this.isLoading.set(false);
          this.snackbar.open('Hiba történt mentéskor! ❌', 'Bezár',{
            duration: 3000
          }); //new snack
        }
      });
    }
  }
  CancelCreation()
  {
    this.router.navigate(['egeszthread', this.id()]);
  }
}
