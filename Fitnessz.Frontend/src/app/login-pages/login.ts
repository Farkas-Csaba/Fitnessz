import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../login-pages-service/auth-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

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
        error: (err: any) => {
          console.error('Login failed', err);
          alert('Bejelentkezés sikertelen. Kérlek próbáld újra.');
          this.isLoading.set(false);
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
