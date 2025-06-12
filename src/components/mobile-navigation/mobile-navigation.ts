import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';
import { PortalManager } from '../../services/portal-manager';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-mobile-navigation',
  styleUrl: './mobile-navigation.scss',
  templateUrl: './mobile-navigation.html',
  imports: [PortalModule],
})
export class MobileNavigationComponent {
  private readonly iconContainer = viewChild<ElementRef>('iconContainer');

  private readonly portalContent =
    viewChild<TemplateRef<null>>('portalContent');

  protected readonly isOpen = signal(false);

  private anim?: AnimationItem;

  private readonly platformId = inject(PLATFORM_ID);

  private readonly totalFrame = 28;

  private readonly speed = 1.5;

  private readonly isInitial = signal(true);

  constructor(
    private portalManager: PortalManager,
    private viewContainerRef: ViewContainerRef
  ) {
    effect(() => {
      const element = this.iconContainer()?.nativeElement;
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

    effect(() => {
      if (!this.portalManager.isOpen() && !this.isInitial()) {
        this.playCloseAnimation();
        this.isOpen.set(false);
      }
    });
  }

  toggleMenu() {
    this.isInitial.set(false);
    if (this.isOpen()) {
      this.playCloseAnimation();
      this.isOpen.set(false);
      this.portalManager.close();
    } else {
      this.playOpenAnimation();
      this.isOpen.set(true);
      const portalContent = this.portalContent();
      if (!portalContent) {
        console.error('Portal content is not defined');
        return;
      }
      this.portalManager.open(
        new TemplatePortal(portalContent, this.viewContainerRef)
      );
    }
  }

  private playOpenAnimation() {
    this.anim?.playSegments([0, this.totalFrame / 2], true);
  }

  private playCloseAnimation() {
    this.anim?.playSegments([this.totalFrame / 2, this.totalFrame], true);
  }
}
