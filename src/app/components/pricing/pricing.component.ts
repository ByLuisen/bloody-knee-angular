import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { finalize, map, of, switchMap, tap, zip } from 'rxjs';
import { Quote } from 'src/app/models/Quote';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
})
export class PricingComponent implements OnInit {
  quotes!: Quote[];
  arrayAdvantages!: any;
  loading: boolean = false;
  role!: string;
  openModal: boolean = false;
  message!: string;
  constructor(
    private http: HttpService,
    public auth: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.http.getQuotes().subscribe((quotes: any[]) => {
      this.quotes = quotes;
      this.arrayAdvantages = this.quotes.map((quote) =>
        quote.advantages.split(';')
      );
    });

    this.route.queryParams.subscribe((params) => {
      if (params['session_id'] && params['success']) {
        this.loading = true;
        zip(
          this.http.getCheckoutSession(params['session_id']),
          this.http.getLineItems(params['session_id'])
        )
          .pipe(
            switchMap(([checkoutSession, lineItems]) => {
              if (checkoutSession.data && lineItems.data) {
                // Procesamos los resultados de ambas llamadas
                const role = lineItems.data.line_items.data[0].description;
                const sub_id =
                  checkoutSession.data.checkout_session.subscription;
                // Llamamos a makeOrder con los resultados de las dos llamadas
                return this.http.updateRole(role, sub_id);
              } else {
                this.loading = false;
                this.http.getRole().subscribe((response) => {
                  this.role = response;
                });
                return of();
              }
            }),tap((response) => {
              if(response) {
                this.role = response.data
                if(this.role == 'Admin') {
                  this.message = response.message;
                }
                this.loading = false;
                this.openModal = true;
              }
            })
          )
          .subscribe();
      } else {
        this.http.getRole().subscribe((response) => {
          this.role = response;
        });
      }
    });

    if (window.location.pathname == '/pricing') {
      document.getElementById('pricing_section')?.classList.add('fondo_bk');
    }
  }

  subscribeToQuote(quotePriceId: string) {
    this.auth.isAuthenticated$
      .pipe(
        switchMap((logged) => {
          if (!logged) {
            return this.auth.loginWithPopup();
          }
          return of(null); // Emite un valor nulo si ya está autenticado
        }),
        switchMap(() => {
          this.loading = true; // Mostrar pantalla de carga
          return this.http.subscribeQuote(quotePriceId); // Devolver el observable
        }),
        tap((response) => {
          if (response) {
            window.location.href = response.data.checkout_url;
          }
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        () => {},
        (error) => {
          console.error('Error al suscribirse a la cotización:', error);
          // Manejar el error en tu aplicación
        }
      );
  }

  getBasic(): void {
    this.loading = true;
    this.http.updateRole('Basic').subscribe((response) => {
      this.role = response.data;
      this.loading = false;
      this.openModal = true;
    });
  }

  closeModal(): void {
    this.openModal = false;
    window.location.href = window.location.origin + '/home';
  }
}
