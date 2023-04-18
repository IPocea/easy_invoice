import { Component, Input, OnInit } from '@angular/core';
import { IMyCompany } from '@interfaces';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  @Input() myCompany: IMyCompany;
  constructor() {}

  ngOnInit(): void {}
}
