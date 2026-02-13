import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../login-pages-service/auth-service';
import {Router, RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  isLoading = signal(false);

  registerform = this.fb.group(
    {
      UserName: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8)]]
    });

  SubmitRegistration()
  {
    if (this.registerform.valid)
    {
      this.isLoading.set(true);
      this.authService.Register(this.registerform.value).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: () => {
          this.snackbar.open('Regisztráció sikertelen, kérem próbálja újra! ❌', 'Bezár', {
            duration: 3000
          });
          this.isLoading.set(false);
        }
      });
    }
    else {
      this.registerform.markAllAsTouched();
    }
  }
}
