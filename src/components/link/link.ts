import { Component, input } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.html',
  styleUrl: './link.scss',
})
export class LinkComponent {
  readonly href = input<string>();
}
