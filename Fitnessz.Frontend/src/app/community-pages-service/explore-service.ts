import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Thread{
  threadId : number,
  title : string,
  authorName: string,
  categoryName: string,
  contentPreview : string,
  createdAt: string
}
@Injectable({
  providedIn: 'root',
})
export class FelfedezesService {
  private http = inject(HttpClient);
  private apiUrl = "https://localhost:5001/ForumThread"

  GetExplorePageThreads (){
    return this.http.get<Thread[]>(this.apiUrl);
  }

  GetThreadsByCategory(categoryId : number) {
    return this.http.get<Thread[]>(this.apiUrl + "/category/" + categoryId);
  }

}
