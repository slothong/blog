import { Subject, takeUntil } from 'rxjs';
import {
  Component,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { LogoComponent } from '@/components/logo/logo';
import { MobileNavigationComponent } from '@/components/mobile-navigation/mobile-navigation';
import { NavigationComponent } from '@/components/navigation/navigation';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [LogoComponent, NavigationComponent, MobileNavigationComponent],
})
export class HeaderComponent implements OnDestroy {
  private readonly destroyed$ = new Subject<void>();

  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isMobile = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      inject(BreakpointObserver)
        .observe([Breakpoints.XSmall])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((result) => {
          this.isMobile.set(result.matches);
        });
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
