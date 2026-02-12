import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ThreadObject} from './create-service';

@Injectable({
  providedIn: 'root',
})
export class DeleteUpdateService {
  private http = inject(HttpClient)
  private apiUrl = 'https://localhost:5001/ForumThread';

  deleteThread(threadId: number)
  {
    return this.http.delete<any>(`${this.apiUrl}/${threadId}`);
  }
  updateThread(thread: ThreadObject, threadId: number)
  {
    return this.http.put<any>(`${this.apiUrl}/${threadId}`, thread);
  }

}
