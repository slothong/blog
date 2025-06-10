import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class LogoComponent {
  readonly imageUrl = input<string>();
  readonly alt = input<string>();
  readonly link = input<string>();
}
