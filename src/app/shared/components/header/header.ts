import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private readonly TOKEN_KEY = 'userToken';
  private readonly EMAIL_KEY = 'userEmail';
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService);

  isLoggedIn = false;

  userEmail: string | null = '';

  ngOnInit(): void {
    let token = localStorage.getItem(this.TOKEN_KEY);
    if (token != null) {
      this.isLoggedIn = true;
      this.userEmail = localStorage.getItem(this.EMAIL_KEY);
    } else {
      this.isLoggedIn = false;
    }
  }

  private title$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    map((route) => (route.snapshot.data['headerText'] as string) || 'Alapértelmezett Cím'),
  );

  onLogout() {
    this.authService.logout();
  }

  // Ebből csinálunk egy reaktív Signalt, amit a HTML-ben meg tudunk jeleníteni
  protected title = toSignal(this.title$, { initialValue: 'Betöltés...' });

  btnClick(): any {
    this.router.navigateByUrl('/login');
  }
}
