import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, of, combineLatest } from 'rxjs';
import { map, catchError, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
class AuthGuardService {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return combineLatest([
      this.auth.isAuthenticated$,
      this.auth.isLoading$,
    ]).pipe(
      // Wait until loading is complete
      filter(([_, loading]) => !loading),
      map(([logged]) => {
        if (logged) {
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('AuthGuard - Error:', error);
        this.router.navigate(['/home']);
        return of(false);
      })
    );
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const authGuardService = inject(AuthGuardService);
  return authGuardService.canActivate();
};
