# Security Advisory: SEC-ADV-004

## Identificação
- **ID**: SEC-ADV-004
- **Título**: Dessincronização de Estado de Sessão e Ausência de Validação no AuthGuard
- **Severidade**: Low (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:L - Base Score: 4.2)
- **CWE**: 
  - CWE-384: Session Fixation
  - CWE-613: Insufficient Session Expiration
- **Componentes Afetados**:
  - `src/app/core/services/auth.service.ts`
  - `src/app/core/guards/auth.guard.ts`
  - `src/app/app.routes.ts`

---

## Descrição do Problema
A autenticação do sistema é baseada em cookies HTTP gerenciados pelo backend com `withCredentials: true`. No entanto, no frontend, a autorização de rotas pelo `authGuard` confia exclusivamente em um `signal` em memória dentro do `AuthService`:
```typescript
// auth.service.ts
private currentUser = signal<User | null>(null);

getUser() {
  return this.currentUser();
}

// auth.guard.ts
const user = authService.getUser();
if (user) {
  return true;
} else {
  return router.createUrlTree(['/login']);
}
```

## Impacto
1. **Perda de Sessão Legítima (Falso Negativo)**: Ao pressionar `F5` ou abrir uma nova aba, o estado em memória é zerado (`currentUser` volta a ser `null`). O usuário é ejetado para `/login`, mesmo com um cookie de sessão válido no navegador.
2. **Ausência de Revalidação Proativa (Falso Positivo)**: Se a sessão for invalidada no backend (timeout, revogação pelo admin), o frontend continuará considerando o usuário autenticado até que alguma requisição HTTP falhe com erro `401`. O `authGuard` não possui mecânica assíncrona (`Observable<boolean | UrlTree>`) para consultar um endpoint de checagem `/auth/me` ou `/auth/validate`.

## Remediação Recomendada
1. Disponibilizar um endpoint `/auth/me` no backend para checagem da sessão ativa via cookie.
2. Tornar o `authGuard` assíncrono para verificar o estado ou recuperar o perfil caso o signal esteja nulo no bootstrap da rota:
   ```typescript
   export const authGuard: CanActivateFn = (route, state) => {
     const authService = inject(AuthService);
     const router = inject(Router);

     if (authService.getUser()) {
       return true;
     }

     return authService.checkSession().pipe(
       map(() => true),
       catchError(() => of(router.createUrlTree(['/login'])))
     );
   };
   ```
