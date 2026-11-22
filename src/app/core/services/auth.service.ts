import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authUrl = `${environment.apiUrl}/auth`;

  private currentUser = signal<User | null>(null);

  getUser() {
    return this.currentUser();
  }

  /**
   * Verifica a sessão ativa no backend com o cookie de sessão.
   */
  checkSession(): Observable<User | null> {
    const user = this.currentUser();
    if (user) {
      return of(user);
    }

    return this.http
      .get<User>(`${this.authUrl}/me`, { withCredentials: true })
      .pipe(
        tap((userResponse) => {
          this.currentUser.set(userResponse);
        }),
        catchError(() => {
          this.currentUser.set(null);
          return of(null);
        }),
      );
  }

  /**
   * Realiza o login no backend via Session.
   * O backend deve setar o cookie de sessão na resposta.
   * É fundamental usar { withCredentials: true } para que o cookie seja salvo.
   */
  login(username: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        `${this.authUrl}/login`,
        { login: username, password },
        { withCredentials: true },
      )
      .pipe(
        tap((userResponse) => {
          this.currentUser.set({
            ...userResponse,
            username,
          });
        }),
      );
  }

  /**
   * Realiza o logout no backend, invalidando a sessão.
   */
  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.authUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUser.set(null);
        }),
      );
  }
}
