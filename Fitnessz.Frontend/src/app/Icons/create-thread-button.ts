import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-thread-button',
  imports: [],
  templateUrl: './create-thread-button.html',
  styleUrl: './create-thread-button.css',
})
export class CreateThreadButton {
  private router = inject(Router);

  navigateToCreatePost(){
    this.router.navigate(['/posztolas'])
  }
}
