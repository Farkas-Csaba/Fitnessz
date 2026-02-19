import { Component, inject, input, output, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {CreateService, PostObject} from '../community-pages-service/create-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-comment',
  imports: [ReactiveFormsModule],
  templateUrl: './create-comment.html',
  styleUrl: './create-comment.css',
})
export class CreateComment {

  private readonly fb = inject(FormBuilder);
  private readonly createService = inject(CreateService);
  private snackbar = inject(MatSnackBar);

  //read after outputs in docs
  readonly threadId = input.required<number>();
  readonly commentPosted = output<void>();


  protected isExpanded = signal(false);
  protected isSubmitting = signal(false);


  protected commentForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  //here i convert the observable which is the valuechange of commentform to a signal so i can use it in my canSubmit
  private formStatus = toSignal(
    this.commentForm.controls.content.valueChanges
  )

  // Computed Logic
  protected canSubmit = computed(() => {

    const currentText = this.formStatus() ?? '';

    return (
      this.isExpanded() &&
      this.commentForm.valid &&
      currentText.trim().length > 0 &&
      !this.isSubmitting()
    );
  });


  protected expand() {
    this.isExpanded.set(true);

  }

  protected collapse() {
    this.isExpanded.set(false);
    this.commentForm.reset();
  }

  protected submitComment() {
    if (!this.canSubmit()) return;

    this.isSubmitting.set(true);
    const postContent :PostObject = {
      content: this.commentForm.getRawValue().content,
      threadId: this.threadId()
    };

    this.createService.createPost(postContent).subscribe({
      next: () => {
        this.commentPosted.emit(); // Notify parent to reload list
        this.collapse();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.snackbar.open("Nem sikerült a kommentelés, kérem próbálja újra  ❌", "bezárás", {
          duration: 3000
        })
      }
    });
  }
}
