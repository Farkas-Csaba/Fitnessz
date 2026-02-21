import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ThreadObject} from './create-service';

export interface updatePostDto {
  content : string
}
@Injectable({
  providedIn: 'root',
})
export class DeleteUpdateService {
  private http = inject(HttpClient)
  private threadApiUrl = 'https://localhost:5001/ForumThread';
  private postApiUrl = 'https://localhost:5001/ForumPost';

  deleteThread(threadId: number)
  {
    return this.http.delete<any>(`${this.threadApiUrl}/${threadId}`);
  }
  deletePost(threadId: number, postId: number)
  {
    return this.http.delete<any>(`${this.postApiUrl}/${threadId}/posts/${postId}`)
  }
  updateThread(thread: ThreadObject, threadId: number)
  {
    return this.http.put<any>(`${this.threadApiUrl}/${threadId}`, thread);
  }
  updatePost(threadId : number, postId: number, content : updatePostDto )
  {
    return this.http.put<any>(`${this.postApiUrl}/${threadId}/posts/${postId}`, content)
  }

}
