import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ThreadObject} from './create-service';
import {environment} from '../../environment';

export interface updatePostDto {
  content : string
}
@Injectable({
  providedIn: 'root',
})
export class DeleteUpdateService {
  private http = inject(HttpClient)
  private api = environment.apiUrl;

  deleteThread(threadId: number)
  {
    return this.http.delete<any>(`${this.api}/ForumThread/${threadId}`);
  }
  deletePost(threadId: number, postId: number)
  {
    return this.http.delete<any>(`${this.api}/ForumPost/${threadId}/posts/${postId}`)
  }
  updateThread(thread: ThreadObject, threadId: number)
  {
    return this.http.put<any>(`${this.api}/ForumThread/${threadId}`, thread);
  }
  updatePost(threadId : number, postId: number, content : updatePostDto )
  {
    return this.http.put<any>(`${this.api}/ForumPost/${threadId}/posts/${postId}`, content)
  }

}
