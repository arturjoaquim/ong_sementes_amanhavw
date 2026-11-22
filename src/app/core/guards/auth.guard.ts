import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();
  if (user) {
    return true;
  }

  return authService.checkSession().pipe(
    map((checkedUser) => {
      if (checkedUser) {
        return true;
      }
      return router.createUrlTree(['/login']);
    }),
  );
};
