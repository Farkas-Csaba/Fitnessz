import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../login-pages-service/auth-service';
import {Router, RouterLink} from '@angular/router';

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

  loginForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  onSubmit() {
    if (this.loginForm.valid) {

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Login failed', err);
          alert('Invalid email or password');
        }
      });
    }
  }
}
