import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroLockClosed } from '@ng-icons/heroicons/outline';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroLockClosed })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);

  username = '';
  password = '';
  readonly loading = signal(false);
  readonly error   = signal('');

  submit(): void {
    if (!this.username || !this.password) return;
    this.loading.set(true);
    this.error.set('');

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: res => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/plans']);
      },
      error: () => {
        this.error.set('Credenciales inválidas');
        this.loading.set(false);
      },
    });
  }
}
