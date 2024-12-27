import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { HttpService } from 'src/app/services/http.service';
import { catchError, finalize, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  loading: boolean = false;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.auth.user$
      .pipe(
        switchMap((data) => {
          this.loading = false;
          return of(data);
        }),
        catchError((error) => {
          console.error('Error al obtener el usuario:', error);
          return of([]);
        })
      )
      .subscribe();
  }
}
