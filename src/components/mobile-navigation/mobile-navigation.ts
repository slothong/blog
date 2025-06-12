import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-mobile-navigation',
  styleUrl: './mobile-navigation.scss',
  host: {
    '(click)': 'toggleMenu()',
  },
  template: '',
})
export class MobileNavigationComponent {
  protected readonly isOpen = signal(false);

  private anim?: AnimationItem;

  private readonly platformId = inject(PLATFORM_ID);

  private readonly totalFrame = 28;

  private readonly speed = 1.5;

  constructor(private elRef: ElementRef) {}

  toggleMenu() {
    if (this.isOpen()) {
      this.playCloseAnimation();
      this.isOpen.set(false);
    } else {
      this.playOpenAnimation();
      this.isOpen.set(true);
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.anim = lottie.loadAnimation({
        container: this.elRef.nativeElement,
        renderer: 'svg',
        loop: false,
        path: 'assets/icons8-menu.json',
        autoplay: false,
      });
      this.anim.setSpeed(this.speed);
    }
  }

  private playOpenAnimation() {
    this.anim?.playSegments([0, this.totalFrame / 2], true);
  }

  private playCloseAnimation() {
    this.anim?.playSegments([this.totalFrame / 2, this.totalFrame], true);
  }
}
