import { Portal } from '@angular/cdk/portal';
import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortalManager {
  readonly portalContent = signal<Portal<any> | null>(null);
  readonly isOpen = computed(() => this.portalContent() !== null);

  open(portalContent: Portal<any>) {
    this.portalContent.set(portalContent);
  }

  close() {
    this.portalContent.set(null);
  }
}
