import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Video } from 'src/app/models/Video';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of, switchMap, tap, zip } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  destacados: Video[] = [];
  videosAleatorios: Video[] = [];
  modalOpen: boolean = false;
  role!: string;

  constructor(
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['session_id'] && params['success']) {
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
                this.http.getRole().subscribe((response) => {
                  this.role = response;
                });
                return of();
              }
            }),
            tap((response) => {
              if (response) {
                this.role = response.data;
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
    this.getDestacados();
  }
  getDestacados(): void {
    this.http.getVideos().subscribe(
      (videos) => {
        this.destacados = videos;
        this.videosAleatorios = this.getRandomVideos(this.destacados, 6);
      },
      (error) => {
        console.error('Error al obtener los videos destacados:', error);
      }
    );
  }

  getRandomVideos(array: Video[], count: number): Video[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  openModal() {
    this.modalOpen = true;
    document.body.classList.add('modal-open');
  }

  // Método para cerrar el modal
  closeModal() {
    this.modalOpen = false;
    document.body.classList.remove('modal-open');
  }

  selectVideo(video: Video) {
    if (
      video.exclusive &&
      this.role != 'Standard' &&
      this.role != 'Premium' &&
      this.role != 'Admin'
    ) {
      this.openModal();
      // Abre el modal si el video es premium y el usuario no tiene un rol premium
    } else {
      this.router.navigate(['/player', video.id]);
      // Navega al componente de reproductor si el usuario tiene permiso para ver el video
    }
  }
}
