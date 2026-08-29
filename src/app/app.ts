import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './shared/components/header/header';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('expense-tracker-ui');
  private authService = inject(AuthService);
  private readonly TOKEN_KEY = 'userToken';

  ngOnInit(): void {
    this.authService.isLoggedIn.set(!!localStorage.getItem(this.TOKEN_KEY));
  }
}
