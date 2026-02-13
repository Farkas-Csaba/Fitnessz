import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../login-pages-service/auth-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private snackbar = inject(MatSnackBar);

  protected isLoading = signal(false);

  loginForm = this.fb.group(
    {
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]]
    });
  SubmitLogin() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.Login(this.loginForm.value).subscribe({
        next: () => {
          const queryparams = this.route.snapshot.queryParams['returnUrl'] || '';
          this.router.navigate([queryparams]);
        },
        error: () => {

          this.snackbar.open('Hiba történt bejelentkezéskor, kérem próbálja újra! ❌', 'Bezár', {
            duration: 3000
          })
          this.isLoading.set(false);
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
