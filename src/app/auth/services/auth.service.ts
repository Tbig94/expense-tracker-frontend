import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoggedIn = signal<boolean>(false);
  currentUser = signal<UserProfile | null>(null);

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  public checkAuthStatus(): Observable<UserProfile | null> {
    return this.http
      .get<UserProfile>(`${environment.apiUrl}/Auth/GetAccountInfo`, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this.currentUser.set(user);
          this.isLoggedIn.set(true);
        }),
        catchError(() => {
          this.currentUser.set(null);
          this.isLoggedIn.set(false);
          return of(null);
        }),
      );
  }

  public login(email: string, password: string): Observable<any> {
    return this.http
      .post<UserProfile>(
        `${environment.apiUrl}/Auth/Login`,
        { email, password },
        { withCredentials: true, timeout: 90000 },
      )
      .pipe(
        tap((user) => {
          this.currentUser.set(user);
          this.isLoggedIn.set(true);
        }),
      );
  }

  public register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/Auth/Register`,
      { name, email, password },
      { withCredentials: true, timeout: 90000 },
    );
  }

  public logout(): void {
    this.http.post(`${environment.apiUrl}/Auth/Logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.handleLogoutCleanup(),
      error: (err) => {
        console.error('Logout error on server', err);
        this.handleLogoutCleanup();
      },
    });
  }

  private handleLogoutCleanup(): void {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);

    this.snackBar.open('Logged out successfully', 'X', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'],
    });

    this.router.navigate(['/login']);
  }

  public deleteAccount(): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/Auth/DeleteAccount`,
      {},
      { withCredentials: true },
    );
  }
}

export interface UserProfile {
  email: string;
  name?: string;
}
