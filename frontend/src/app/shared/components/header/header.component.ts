import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMyCompany } from '@interfaces';
import { AuthService, LoginDataService, NotificationService, StorageService } from '@services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() myCompany: IMyCompany;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private loginDataService: LoginDataService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.removeItem('tokens');
        this.loginDataService.setNextLoggedUser(null);
        this.router.navigate(['/login']);
      },
      error: (e) => {
        this.notificationService.error(
          e.error.message || 'An unexpected error has occured'
        );
      },
    });
  }
}
