import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { IUser } from '@interfaces';
import { LoginDataService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginDataService: LoginDataService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let user: IUser = this.loginDataService.getLoggedUser();
    if (user && user?.role === 'admin') {
      return true;
    } else {
      this.router.navigate(['/bine-ai-venit']);
      return false;
    }
  }
}
