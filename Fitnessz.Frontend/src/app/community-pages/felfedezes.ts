import {Component, inject} from '@angular/core';
import {FelfedezesService, ThreadExplore} from '../community-pages-service/felfedezes-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-felfedezes',
  imports: [DatePipe],
  templateUrl: './felfedezes.html',
  styleUrl: './felfedezes.css',
})
export class Felfedezes {
  ThreadService = inject(FelfedezesService);
  threads = toSignal(this.ThreadService.GetExplorePageThreads(), {initialValue: []})

  onThreadClick(thread : ThreadExplore)
  {
    //load the full content of thread
  }
}
