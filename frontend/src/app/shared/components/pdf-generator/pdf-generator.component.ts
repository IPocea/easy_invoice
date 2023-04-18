import { Component, Input, OnInit } from '@angular/core';
// import Quill from 'quill';

// class PreserveWhiteSpace {
//   constructor(private quill: any, private options: {}) {
//     quill.container.style.whiteSpace = 'pre-line';
//   }
// }

// Quill.register('modules/preserveWhiteSpace', PreserveWhiteSpace);

@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styleUrls: ['./pdf-generator.component.scss'],
})
export class PdfGeneratorComponent implements OnInit {
  @Input() pdfContent: string;
  constructor() {}

  ngOnInit(): void {}

  generatePDF() {

  }
}
