import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../login-pages-service/auth-service';
import {Router, RouterLink} from '@angular/router';

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
      this.authService.Register(this.registerform.value).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err: any) => {
          console.error('Registration failed', err);
          alert('Regisztráció sikertelen. Kérlek próbáld újra.');
        }
      });
    }
    else {
      this.registerform.markAllAsTouched();
    }
  }
}
