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
@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  private http = inject(HttpClient);
  private apiUrl = "https://localhost:5001/ForumThread";
  private router = inject(Router);

  navigateToThread(thread : ThreadPreview)
  {
    this.router.navigate(['egeszthread', thread.threadId])
  }

  GetExplorePageThreads (){
    return this.http.get<ThreadPreview[]>(this.apiUrl);
  }

  GetThreadsByCategory(categoryId : number) {
    return this.http.get<ThreadPreview[]>(this.apiUrl + "/category/" + categoryId);
  }

  GetFullThreadByThreadID(threadId: number)
  {
    return this.http.get<Thread>(this.apiUrl + '/' + threadId);
  }

}
