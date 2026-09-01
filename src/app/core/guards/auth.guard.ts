import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Ha már bizonyítottan be van lépve (pl. alkalmazáson belüli navigáció során)
  if (authService.isLoggedIn()) {
    return true;
  }

  // Oldal frissítésekor/megnyitásakor megvárjuk a backend válaszát:
  return authService.checkAuthStatus().pipe(
    map((user) => {
      if (user && user.email) {
        return true;
      }
      return router.createUrlTree(['/login']);
    }),
  );
};
