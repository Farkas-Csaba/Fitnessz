import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Category} from '../community-pages/create-thread/create-thread';
import {Observable} from 'rxjs';

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
  private categoryApiUrl = "https://localhost:5001/ForumCategory";
  private router = inject(Router);

  navigateToThread(thread : ThreadPreview)
  {
    this.router.navigate(['egeszthread', thread.threadId]);
  }

  getExplorePageThreads (){
    return this.http.get<ThreadPreview[]>(this.threadApiUrl);
  }

  getThreadsByCategory(categoryId : number) {
    return this.http.get<ThreadPreview[]>(`${this.threadApiUrl}/category/${categoryId}`);
  }

  getFullThreadByThreadID(threadId: number)
  {
    return this.http.get<Thread>(`${this.threadApiUrl}/${threadId}`);
  }

  getCommentsByThreadId(threadId: number)
  {
    return this.http.get<Post[]>(`${this.postApiUrl}/${threadId}/posts`);
  }
  getCategories(): Observable<Category[]>
  {
    return this.http.get<Category[]>(this.categoryApiUrl);
  }


}
