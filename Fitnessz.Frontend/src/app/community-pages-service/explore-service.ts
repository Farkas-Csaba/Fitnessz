import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

export interface ThreadPreview{
  threadId : number,
  title : string,
  authorName: string,
  categoryName: string,
  contentPreview : string,
  createdAt: string
}
export interface Thread{
  threadId : number,
  title : string,
  authorName: string,
  categoryName: string,
  content: string,
  createdAt: string
}
export interface Post{
  postId : number,
  authorName : string,
  createdAt : string,
  content : string

}
@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  private http = inject(HttpClient);
  private threadApiUrl = "https://localhost:5001/ForumThread";
  private postApiUrl = "https://localhost:5001/ForumPost";
  private router = inject(Router);

  NavigateToThread(thread : ThreadPreview)
  {
    this.router.navigate(['egeszthread', thread.threadId])
  }

  GetExplorePageThreads (){
    return this.http.get<ThreadPreview[]>(this.threadApiUrl);
  }

  GetThreadsByCategory(categoryId : number) {
    return this.http.get<ThreadPreview[]>(`${this.threadApiUrl}/category/${categoryId}`);
  }

  GetFullThreadByThreadID(threadId: number)
  {
    return this.http.get<Thread>(`${this.threadApiUrl}/${threadId}`);
  }

  GetCommentsByThreadId(threadId: number)
  {
    return this.http.get<Post[]>(`${this.postApiUrl}/${threadId}/posts`)
  }

}
