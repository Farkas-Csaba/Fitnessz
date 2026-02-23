import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environment';


export interface ThreadObject {
  title : string,
  content?: string | null,
  categoryId : number
}
export interface PostObject {
  content: string,
  threadId: number
}
@Injectable({
  providedIn: 'root',
})
export class CreateService {
  private api = environment.apiUrl;
  private http = inject(HttpClient);
  createThread(thread : ThreadObject) : Observable<any>{
    return this.http.post(`${this.api}/ForumThread`, thread);
  }

  createPost(postContent: PostObject)
  {
    const dto = { content: postContent.content };
    return this.http.post(`${this.api}/ForumPost${postContent.threadId}/posts`, dto);
  }

}
