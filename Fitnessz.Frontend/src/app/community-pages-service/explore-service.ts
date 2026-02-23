import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Category} from '../community-pages/create-thread/create-thread';
import {Observable} from 'rxjs';
import {environment} from '../../environment';

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
  categoryId: number,
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
  private router = inject(Router);
  private api = environment.apiUrl;

  navigateToThread(thread : ThreadPreview)
  {
    this.router.navigate(['egeszthread', thread.threadId]);
  }

  getExplorePageThreads (){
    return this.http.get<ThreadPreview[]>(`${this.api}/ForumThread`);
  }

  getThreadsByCategory(categoryId : number) {
    return this.http.get<ThreadPreview[]>(`${this.api}/ForumThread/category/${categoryId}`);
  }

  getFullThreadByThreadID(threadId: number)
  {
    return this.http.get<Thread>(`${this.api}/ForumThread/${threadId}`);
  }

  getCommentsByThreadId(threadId: number)
  {
    return this.http.get<Post[]>(`${this.api}/ForumPost/${threadId}/posts`);
  }
  getCategories(): Observable<Category[]>
  {
    return this.http.get<Category[]>(`${this.api}/ForumCategory`);
  }


}
