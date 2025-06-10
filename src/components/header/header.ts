import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo';
import { NavigationComponent } from '../navigation/navigation';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [LogoComponent, NavigationComponent],
})
export class HeaderComponent {}
