import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


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
  threadApiUrl = 'https://localhost:5001/ForumThread';
  postApiUrl = 'https://localhost:5001/ForumPost'
  http = inject(HttpClient);
  createThread(thread : ThreadObject) : Observable<any>{
    return this.http.post(this.threadApiUrl, thread);
  }

  createPost(postContent: PostObject)
  {
    const dto = { content: postContent.content };
    return this.http.post(`${this.postApiUrl}/${postContent.threadId}/posts`, dto);
  }

}
