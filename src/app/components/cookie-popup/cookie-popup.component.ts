import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cookie-popup',
  templateUrl: './cookie-popup.component.html',
  styleUrls: ['./cookie-popup.component.css']
})
export class CookiePopupComponent {
  openCookie: boolean = true;

  constructor(private cookie: CookieService){}

  closeCookie() {
    this.cookie.set('cookie', 'true', 365, '/');
    this.openCookie = false;
  }
}
