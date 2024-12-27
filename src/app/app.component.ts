import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpService } from './services/http.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Bloody Knee';

  constructor(private http: HttpService, public cookie:CookieService) {
    this.http.initUser();
  }
}
