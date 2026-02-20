import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthTokenService } from '../../core/services/auth-token.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly isAuthenticated = computed(() => this.authTokenService.token() !== null);

  constructor(
    private readonly authTokenService: AuthTokenService,
    private readonly router: Router,
  ) {}

  logout(): void {
    this.authTokenService.clearToken();
    void this.router.navigate(['/login']);
  }
}
