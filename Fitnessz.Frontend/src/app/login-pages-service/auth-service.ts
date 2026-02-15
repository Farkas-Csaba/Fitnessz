import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { tap} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  apiRoute = "https://localhost:5001/ForumAuth";
  router = inject(Router);

  currentUser = signal<{username : string, token: string} | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  constructor() {
    //should this be an effect?
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('fitness_user');
      if (savedUser) {
        this.currentUser.set(JSON.parse(savedUser));
      }
    }
  }
  Login (credentials: any )
  {
    return this.http.post<any>(`${this.apiRoute}/login`, credentials).pipe(
      tap(res => {
        this.currentUser.set(res);
        localStorage.setItem("fitness_user", JSON.stringify(res));
      } )
    );
  }
  Register(credentials : any)
  {
    return this.http.post<any>(`${this.apiRoute}/register`, credentials).pipe(
      tap(res=>{
        this.currentUser.set(res);
        localStorage.setItem("fitness_user", JSON.stringify(res));
      })
    );
  }
  Logout(){
    this.currentUser.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem("fitness_user");
    }
    this.router.navigate(['']);
  }
}
