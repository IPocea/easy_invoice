import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { passwordRegExp, getPasswordToolTip } from '@utils';
import { ConfirmedValidator } from '@shared/custom-validators/confirmed.validator';
import { ITableFilters, IUser } from '@interfaces';
import { NotificationService, UserService } from '@services';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.scss'],
})
export class ChangeUserPasswordComponent implements OnInit {
  isLoading: boolean = false;
  user: IUser = null;
  filters: ITableFilters = null;
  errorMessage: string = '';
  changePasswordForm: FormGroup;
  changePasswordBtnMessage: string = 'Schimba Parola';
  passwordRegExp: RegExp = passwordRegExp();
  passwordTooltip: string = getPasswordToolTip();
  isPasswordHidden: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ChangeUserPasswordComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        password: [
          null,
          [Validators.required, Validators.pattern(this.passwordRegExp)],
        ],
        confirmPassword: [null, [Validators.required]],
      },
      {
        validators: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  changePassword(): void {
    this.isLoading = true;
    this.changePasswordBtnMessage = 'Se schimba parola...';
    const password = this.changePasswordForm.value.password;
    this.changePass(this.user._id, password);
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  get f() {
    return this.changePasswordForm.controls;
  }

  private changePass(userId: string, password: string): void {
    this.userService
      .updateUserPassword(userId, password, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.changePasswordBtnMessage = 'Schimba Parola';
        })
      )
      .subscribe({
        next: (usersData) => {
          this.dialogRef.close({
            event: 'Change Password',
            usersData: usersData,
          });
        },
        error: (err) => {
          this.notificationService.error(
            err.error.message ||
              'A intervenit o eroare. Te rugam sa dai refresh la pagina si sa incerci din nou'
          );
        },
      });
  }
}
