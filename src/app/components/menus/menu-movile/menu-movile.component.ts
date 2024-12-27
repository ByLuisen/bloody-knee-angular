import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-menu-movile',
  templateUrl: './menu-movile.component.html',
  styleUrls: ['./menu-movile.component.css']
})
export class MenuMovileComponent {
  expanded: boolean = false;

  constructor(@Inject(DOCUMENT) public document: Document, private elementRef: ElementRef, public auth: AuthService) {}

  expandDiv() {
    const div = this.document.getElementById("expandibleDiv")!;
    const button = this.elementRef.nativeElement.querySelector(".fixed-button") as HTMLElement;

    if (!this.expanded) {
      // Expandir el div
      div.style.height = "390px"; // Cambia este valor al deseado
    } else {
      // Revertir los cambios en el botón y el div
      button.style.bottom = "40px";
      button.style.right = "40px";
      button.style.transform = "none";
      div.style.height = "0";
    }
    this.expanded = !this.expanded;
  }

  getLocationOrigin(): string {
    return this.document.location.origin;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const div = this.document.getElementById("expandibleDiv")!;
    const button = this.elementRef.nativeElement.querySelector(".fixed-button");

    // Si se hace clic fuera del botón o del menú expandible, cerrar el menú
    if (!button.contains(target) && !div.contains(target) && this.expanded) {
      this.expandDiv();
    }
  }
}
