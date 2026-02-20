import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>MEAN Stack</h1>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
            >Home</a
          >
          <a routerLink="/auth/login" routerLinkActive="active">Login</a>
        </nav>
      </header>
      <main class="app-main">
        <router-outlet />
      </main>
      <footer class="app-footer">
        <p>Cloud-native MEAN boilerplate &bull; TypeScript</p>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .app-header {
        padding: 1rem 2rem;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .app-header h1 {
        font-size: 1.5rem;
        margin: 0;
      }
      .app-header nav {
        display: flex;
        gap: 1.5rem;
      }
      .app-header a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;
      }
      .app-header a:hover,
      .app-header a.active {
        text-decoration: underline;
      }
      .app-main {
        flex: 1;
        padding: 2rem;
      }
      .app-footer {
        padding: 1rem 2rem;
        text-align: center;
        color: var(--color-muted);
        font-size: 0.875rem;
        border-top: 1px solid var(--color-border);
      }
    `,
  ],
})
export class AppComponent {
  title = 'MEAN Stack';
}
