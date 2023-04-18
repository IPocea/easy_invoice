import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IUser } from '@interfaces';
import {
  AuthService,
  LoginDataService,
  NotificationService,
  StorageService,
  UserService,
} from '@services';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { finalize, take } from 'rxjs';
import { ChangeOwnPasswordComponent } from './components/change-own-password/change-own-password.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  isLoading: boolean = true;
  isLoggingOut: boolean = false;
  noteValue: string = '';
  currentUser: IUser = null;
  changePassDialogRef: MatDialogRef<ChangeOwnPasswordComponent>;
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private userService: UserService,
    private loginDataService: LoginDataService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.noteValue = this.storageService.getItem('userNote')
      ? (this.storageService.getItem('userNote') as string)
      : '';
    this.getProfile();
  }

  logout(): void {
    this.isLoggingOut = true;
    this.confirmAndLogout();
  }

  openChangePass(): void {
    this.changePassDialogRef = this.dialog.open(ChangeOwnPasswordComponent, {
      disableClose: true,
    });
    this.changePassDialogRef.componentInstance.user = this.currentUser;
    this.changePassDialogRef.afterClosed().subscribe((res) => {
      if (res?.event === 'Change Password') {
        this.notificationService.info('Parola a fost modificata cu succes');
      }
    });
  }

  saveNote(): void {
    this.storageService.setItem('userNote', this.noteValue);
  }

  private confirmAndLogout(): void {
    this.confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
    });
    this.confirmDialogRef.componentInstance.title = 'Logout';
    this.confirmDialogRef.componentInstance.content =
      'Esti sigur ca doresti sa te deloghezi?';
    this.confirmDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.doLogout();
      } else {
        this.isLoggingOut = false;
      }
    });
  }

  private doLogout(): void {
    this.authService
      .logout()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoggingOut = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.storageService.removeItem('tokens');
          this.loginDataService.setNextLoggedUser(null);
          this.router.navigate(['/login']);
          this.notificationService.info('Ai fost delogat cu succes');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private getProfile(): void {
    this.userService
      .getProfile()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (profile) => {
          this.currentUser = profile;
          this.loginDataService.setNextLoggedUser(profile);
        },
        error: (err) => {},
      });
  }
}
