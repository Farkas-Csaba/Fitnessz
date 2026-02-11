import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface ThreadObject {
  title : string,
  content?: string | null,
  categoryId : number
}
@Injectable({
  providedIn: 'root',
})
export class CreateService {
  apiUrl = 'https://localhost:5001/ForumThread'
  http = inject(HttpClient);
  createThread(thread : ThreadObject) : Observable<any>{
    return this.http.post(this.apiUrl, thread);
  }

}
