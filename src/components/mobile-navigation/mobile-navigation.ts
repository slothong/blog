import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-mobile-navigation',
  styleUrl: './mobile-navigation.scss',
  templateUrl: './mobile-navigation.html',
})
export class MobileNavigationComponent {
  private readonly iconContainer = viewChild<ElementRef>('iconContainer');

  protected readonly isOpen = signal(false);

  private anim?: AnimationItem;

  private readonly platformId = inject(PLATFORM_ID);

  private readonly totalFrame = 28;

  private readonly speed = 1.5;

  constructor(private elRef: ElementRef) {
    effect(() => {
      const element = this.iconContainer()?.nativeElement;
      console.log(element);
      if (isPlatformBrowser(this.platformId) && element) {
        this.anim = lottie.loadAnimation({
          container: element,
          renderer: 'svg',
          loop: false,
          path: 'assets/icons8-menu.json',
          autoplay: false,
        });
        this.anim.setSpeed(this.speed);
      }
    });
  }

  toggleMenu() {
    if (this.isOpen()) {
      this.playCloseAnimation();
      this.isOpen.set(false);
    } else {
      this.playOpenAnimation();
      this.isOpen.set(true);
    }
  }

  private playOpenAnimation() {
    this.anim?.playSegments([0, this.totalFrame / 2], true);
  }

  private playCloseAnimation() {
    this.anim?.playSegments([this.totalFrame / 2, this.totalFrame], true);
  }
}
