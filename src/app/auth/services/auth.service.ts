import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';

interface JwtPayload {
  exp: number; // Unix timestamp (másodperc)
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'userToken';
  private readonly EMAIL_KEY = 'userEmail';

  private http = inject(HttpClient);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoggedIn = signal<boolean>(!!localStorage.getItem(this.TOKEN_KEY));
  userEmail = signal<string | null>(localStorage.getItem(this.EMAIL_KEY));

  public login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Auth/Login`, { email, password }).pipe(
      tap({
        next: () => this.isLoggedIn.set(true), // Csak sikeres kérés esetén fut le!
      }),
    );
  }

  public register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Auth/Register`, { name, email, password });
  }

  public logout(): void {
    this.clearToken();
    this.isLoggedIn.set(false);
    this.snackBar.open('Logged out successfully', 'X', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'],
    });
    this.router.navigate(['/login']);
  }

  public deleteAccount(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Auth/DeleteAccount`, {});
  }

  public getAccountInfo(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Auth/GetAccountInfo`);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string, email: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EMAIL_KEY, email);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const nowInSeconds = Date.now() / 1000;
      return decoded.exp > nowInSeconds;
    } catch {
      return false;
    }
  }
}
