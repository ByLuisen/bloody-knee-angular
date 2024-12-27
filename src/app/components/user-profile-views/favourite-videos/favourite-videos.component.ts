import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Video } from 'src/app/models/Video';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-favourite-videos',
  templateUrl: './favourite-videos.component.html',
  styleUrls: ['./favourite-videos.component.css']
})
export class FavouriteVideosComponent implements OnInit {
  favoriteVideos: Video[] = [];
  modalOpen: boolean = false;
  role!: string;
  constructor(private http: HttpService, private router: Router, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.http.getRole().subscribe((response) => {
      this.role = response
    });
    this.http.getFavoriteVideos().subscribe(
      (videos) => {
        this.favoriteVideos = videos;
      },
      (error) => {
        console.error('Error al obtener los vídeos favoritos:', error);
      }
    );
  }

  openModal() {
    this.modalOpen = true;
    document.body.classList.add('modal-open');
    // Agrega una clase para evitar el scroll del body
  }

  // Método para cerrar el modal
  closeModal() {
    this.modalOpen = false;
    document.body.classList.remove('modal-open');
    // Remueve la clase que evita el scroll del body
  }

  selectVideo(video: Video) {
    if (video.exclusive && this.role != 'Standard' && this.role != 'Premium' && this.role != 'Admin') {
      this.openModal();
      // Abre el modal si el video es premium y el usuario no tiene un rol premium
    } else {
      this.router.navigate(['/player', video.id]);
      // Navega al componente de reproductor si el usuario tiene permiso para ver el video
    }
  }
}
