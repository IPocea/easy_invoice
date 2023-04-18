import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import {
  LoginDataService,
  NotificationService,
  StorageService,
  TokenService,
} from '@services';
import { Router } from '@angular/router';
import { ITokens } from '@interfaces';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private storageService: StorageService,
    private tokenService: TokenService,
    private notificationService: NotificationService,
    private router: Router,
    private loginDataService: LoginDataService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const tokens: ITokens = this.storageService.getItem('tokens') as ITokens;

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${tokens?.accessToken}`,
      },
    });

    return next.handle(request).pipe(
      catchError((error) => {
        // when accessToken is invalid or expired use refresh token
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          error.error.message === 'Token de acces invalid'
        ) {
          return this.tokenService.useRefreshToken(tokens.refreshToken).pipe(
            switchMap((tokens: ITokens) => {
              this.storageService.setItem('tokens', tokens);
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens?.accessToken}`,
                },
              });
              return next.handle(request);
            }),
            catchError((err) => {
              if (
                err instanceof HttpErrorResponse &&
                err.status === 498 &&
                (err.error.error === 'Tokenul refresh a expirat' ||
                  err.error.error === 'Acces interzis')
              ) {
                this.storageService.removeItem('tokens');
                this.loginDataService.setNextLoggedUser(null);
                this.router.navigate(['/login']);
                this.notificationService.error(
                  err.error.error + '. Te rugam sa te loghezi'
                );
              }
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
