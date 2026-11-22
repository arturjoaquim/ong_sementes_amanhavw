import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService, User } from '../services/auth.service';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    username: 'admin',
    email: 'admin@ong.org',
    role: 'admin',
  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'getUser',
      'checkSession',
    ]);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow access immediately if user is already in memory', () => {
    authServiceSpy.getUser.and.returnValue(mockUser);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBeTrue();
    expect(authServiceSpy.checkSession).not.toHaveBeenCalled();
  });

  it('should revalidate with checkSession if user is not in memory and allow if session is valid', (done) => {
    authServiceSpy.getUser.and.returnValue(null);
    authServiceSpy.checkSession.and.returnValue(of(mockUser));

    const result$ = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any)) as any;

    result$.subscribe((allowed: boolean | UrlTree) => {
      expect(allowed).toBeTrue();
      done();
    });
  });

  it('should redirect to /login if checkSession returns null', (done) => {
    const dummyUrlTree = {} as UrlTree;
    authServiceSpy.getUser.and.returnValue(null);
    authServiceSpy.checkSession.and.returnValue(of(null));
    routerSpy.createUrlTree.and.returnValue(dummyUrlTree);

    const result$ = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any)) as any;

    result$.subscribe((target: boolean | UrlTree) => {
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
      expect(target).toBe(dummyUrlTree);
      done();
    });
  });
});
