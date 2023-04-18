import { Component, Input, OnInit } from '@angular/core';
import { IMyCompany, IUser } from '@interfaces';
import { LoginDataService, ScrollService } from '@services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  @Input() user: IUser;
  liName: string = 'welcome';
  constructor(
    private scrollService: ScrollService,
    private loginDataService: LoginDataService
  ) {}

  ngOnInit(): void {

  }

  scrollToPages(): void {
    this.scrollService.scrollTo('main-right-side-pages');
  }

}
