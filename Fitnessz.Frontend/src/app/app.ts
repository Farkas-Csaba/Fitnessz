import {Component, inject, signal} from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {AuthService} from './login-pages-service/auth-service';


@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: 'app.html',
  styleUrl: 'app.css'

})
export class App {
  protected authService = inject(AuthService);
}
