import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  private authUrl = 'http://localhost:8080/auth';

  private currentUser = signal<User | null>(null);

  getUser() {
    return this.currentUser();
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
