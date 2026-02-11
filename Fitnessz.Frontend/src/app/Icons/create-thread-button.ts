import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../login-pages-service/auth-service';

@Component({
  selector: 'app-create-thread-button',
  imports: [],
  templateUrl: './create-thread-button.html',
  styleUrl: './create-thread-button.css',
})
export class CreateThreadButton {
  private router = inject(Router);
  authService = inject(AuthService);
  navigateToCreatePost(){
    if (this.authService.isLoggedIn())
    {
      this.router.navigate(['/posztolas'])
    }
    else
    {
      this.router.navigate(['/bejelentkezes'], {queryParams: {returnUrl: '/posztolas'}})
    }

  }
}
