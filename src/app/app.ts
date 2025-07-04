import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortalModule } from '@angular/cdk/portal';
import { HeaderComponent } from '@/components/header/header';
import { PortalManager } from '@/services/portal-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, HeaderComponent, PortalModule],
})
export class App {
  protected readonly isPortalOpen = computed(() => this.portalManager.isOpen());
  protected readonly portalOutlet = computed(() =>
    this.portalManager.portalContent()
  );

  constructor(private portalManager: PortalManager) {}

  closePortal() {
    this.portalManager.close();
  }
}
