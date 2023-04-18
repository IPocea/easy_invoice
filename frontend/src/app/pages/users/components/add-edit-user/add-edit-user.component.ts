import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  emailRegExp,
  nameRegExp,
  passwordRegExp,
  usernameRegExp,
  cleanForm,
  getPasswordToolTip,
  getUsernameToolTip,
} from '@utils';
import { ConfirmedValidator } from '@shared/custom-validators/confirmed.validator';
import { IStatusChoices, ITableFilters, IUser } from '@interfaces';
import { NotificationService, UserService } from '@services';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
})
export class AddEditUserComponent implements OnInit {
  isLoading: boolean = false;
  addEditUserForm: FormGroup;
  isPasswordHidden: boolean = true;
  usernameRegExp: RegExp = usernameRegExp();
  emailRegExp: RegExp = emailRegExp();
  passwordRegExp: RegExp = passwordRegExp();
  nameRegExp: RegExp = nameRegExp();
  usernameTooltip: string = getUsernameToolTip();
  passwordTooltip: string = getPasswordToolTip();
  userStatusChoices: IStatusChoices[] = [
    { value: true, viewValue: 'Activ' },
    { value: false, viewValue: 'Inactiv' },
  ];
  addEditUserBtnMessage: string = '';
  filters: ITableFilters = null;
  user: IUser = null;

  constructor(
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.user) {
      this.addEditUserBtnMessage = 'Editeaza User';
      this.addEditUserForm = this.fb.group(
        {
          username: [
            this.user.username,
            [Validators.required, Validators.pattern(this.usernameRegExp)],
          ],
          firstName: [
            this.user.firstName,
            [Validators.required, Validators.pattern(this.nameRegExp)],
          ],
          lastName: [
            this.user.lastName,
            [Validators.required, Validators.pattern(this.nameRegExp)],
          ],
          email: [
            this.user.email,
            [Validators.required, Validators.pattern(this.emailRegExp)],
          ],
          isActivated: [this.user.isActivated, [Validators.required]],
          password: [null],
          confirmPassword: [null],
        },
        {
          validators: ConfirmedValidator('password', 'confirmPassword'),
        }
      );
    } else {
      this.addEditUserBtnMessage = 'Adauga User';
      this.addEditUserForm = this.fb.group(
        {
          username: [
            null,
            [Validators.required, Validators.pattern(this.usernameRegExp)],
          ],
          firstName: [
            null,
            [Validators.required, Validators.pattern(this.nameRegExp)],
          ],
          lastName: [
            null,
            [Validators.required, Validators.pattern(this.nameRegExp)],
          ],
          email: [
            null,
            [Validators.required, Validators.pattern(this.emailRegExp)],
          ],
          password: [
            null,
            [Validators.required, Validators.pattern(this.passwordRegExp)],
          ],
          confirmPassword: [null, [Validators.required]],
          isActivated: [true, [Validators.required]],
        },
        {
          validators: ConfirmedValidator('password', 'confirmPassword'),
        }
      );
    }
  }

  addEditUser(): void {
    this.isLoading = true;
    this.addEditUserBtnMessage = this.user
      ? 'Se editeaza userul...'
      : 'Se adauga user...';
    cleanForm(this.addEditUserForm);
    const user: IUser = this.user
      ? {
          username: this.addEditUserForm.value.username,
          email: this.addEditUserForm.value.email,
          firstName: this.addEditUserForm.value.firstName,
          lastName: this.addEditUserForm.value.lastName,
          isActivated: this.addEditUserForm.value.isActivated,
        }
      : {
          username: this.addEditUserForm.value.username,
          email: this.addEditUserForm.value.email,
          password: this.addEditUserForm.value.password,
          firstName: this.addEditUserForm.value.firstName,
          lastName: this.addEditUserForm.value.lastName,
          isActivated: this.addEditUserForm.value.isActivated,
          role: 'user',
        };
    if (this.user) {
      this.updateUser(user);
    } else {
      this.createUser(user);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  get f() {
    return this.addEditUserForm.controls;
  }
  private createUser(user: IUser): void {
    this.userService
      .createUser(user, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (usersData) => {
          this.addEditUserBtnMessage = 'Adauga User';
          this.dialogRef.close({ event: 'Add User', usersData: usersData });
        },
        error: (err) => {
          this.notificationService.error(
            err.error.message ||
              'A intervenit o eroare. Te rugam sa dai refresh la pagina si sa incerci din nou'
          );
          this.addEditUserBtnMessage = 'Adauga User';
        },
      });
  }

  private updateUser(user: IUser): void {
    this.userService
      .updateUser(this.user._id, user, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (usersData) => {
          this.addEditUserBtnMessage = 'Editeaza User';
          this.dialogRef.close({ event: 'Edit User', usersData: usersData });
        },
        error: (err) => {
          this.notificationService.error(
            err.error.message ||
              'A intervenit o eroare. Te rugam sa dai refresh la pagina si sa incerci din nou'
          );
          this.addEditUserBtnMessage = 'Editeaza User';
        },
      });
  }
}
