import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { tap} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environment';

export interface UserSession{
  username: string,
  token: string
}
export interface TokenObject{
  token: string
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;
  private router = inject(Router);

  currentUser = signal<{username : string, token: string} | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('fitness_user');
      if (savedUser) {
        this.currentUser.set(JSON.parse(savedUser));
      }
    }
  }
  private handleAuth(res: UserSession) {
    this.currentUser.set(res);
    localStorage.setItem("fitness_user", JSON.stringify(res));
  }
  Login (credentials: any )
  {
    return this.http.post<UserSession>(`${this.api}/ForumAuth/login`, credentials, {withCredentials: true}).pipe(
      tap(res => this.handleAuth(res) )
    );
  }
  Register(credentials : any)
  {
    return this.http.post<UserSession>(`${this.api}/ForumAuth/register`, credentials, {withCredentials: true}).pipe(
      tap(res=>this.handleAuth(res))
    );
  }
  RefreshToken() {
    const payload = {
      UserName: this.currentUser()?.username
    };
    return this.http.post<TokenObject>(`${this.api}/ForumAuth/Refresh`, payload, {withCredentials: true}).pipe(
      tap(res  => {
        const updatedSession = {username: this.currentUser()!.username, token: res.token}
        this.handleAuth(updatedSession)
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
