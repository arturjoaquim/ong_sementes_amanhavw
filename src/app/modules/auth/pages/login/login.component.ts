import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LucideAngularModule, LogIn } from 'lucide-angular';
import { ButtonDirective } from '../../../../shared/directives/button.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, ButtonDirective],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <div class="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <lucide-icon [img]="icons.logIn" class="h-6 w-6 text-green-600"></lucide-icon>
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ONG Sementes do Amanhã
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Entre com suas credenciais para acessar
          </p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div class="mb-4">
              <label for="username" class="sr-only">Usuário</label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Usuário"
                [class.border-red-500]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Senha</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
            </div>
          </div>

          @if (errorMessage()) {
            <div class="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {{ errorMessage() }}
            </div>
          }

          <div>
            <button
              appButton
              variant="default"
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              [disabled]="loginForm.invalid || isLoading()"
            >
              @if (isLoading()) {
                <span class="mr-2">Entrando...</span>
              } @else {
                Entrar
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  icons = { logIn: LogIn };
  isLoading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { username, password } = this.loginForm.value;

      this.authService.login(username!, password!).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Falha no login. Verifique suas credenciais.');
          console.error('Login error:', err);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
