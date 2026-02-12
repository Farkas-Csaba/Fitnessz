import {CanActivateFn, Router} from '@angular/router';
import {inject, PLATFORM_ID} from '@angular/core';
import {ExploreService} from '../community-pages-service/explore-service';
import {AuthService} from '../login-pages-service/auth-service';
import {catchError, map, of} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

export const editGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const exploreService = inject(ExploreService);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }
  const threadId = Number(route.paramMap.get('id'));
  const user = authService.currentUser();

  if (!user || !threadId) return router.parseUrl('');

  return exploreService.getFullThreadByThreadID(threadId).pipe(
    map(thread => {
      const isAuthor = thread.authorName === user.username;
      return isAuthor ? true : router.parseUrl('');
    }),
    catchError(() => of(router.parseUrl('')))
  );
};
