import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../login-pages-service/auth-service';
import {Fullthread} from '../community-pages/full-thread/fullthread';
import {isPlatformBrowser} from '@angular/common';
import {PLATFORM_ID} from '@angular/core';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }
  return authService.isLoggedIn()
    ? true
    : router.parseUrl('/bejelentkezes');
};

