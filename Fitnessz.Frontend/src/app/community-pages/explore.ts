import {Component, inject} from '@angular/core';
import {FelfedezesService, Thread} from '../community-pages-service/felfedezes-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-felfedezes',
  imports: [DatePipe],
  templateUrl: './felfedezes.html',
  styleUrl: './felfedezes.css',
})
export class Felfedezes {
  ThreadService = inject(FelfedezesService); //read docs on whether this should be private
  threads = toSignal(this.ThreadService.GetExplorePageThreads(), {initialValue: []})

  openThread(thread : Thread)
  {
    //load the full content of thread
  }
}
