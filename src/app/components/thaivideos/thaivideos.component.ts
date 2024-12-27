import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Video } from 'src/app/models/Video';
import { Router } from '@angular/router';
import { finalize, of, switchMap, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-thaivideos',
  templateUrl: './thaivideos.component.html',
  styleUrls: ['./thaivideos.component.css'],
})
export class ThaivideosComponent implements OnInit {
  // Arreglo para almacenar los videos
  todos: Video[] = [];
  videosSaco: Video[] = [];
  videosPareja: Video[] = [];
  videosConEquipamiento: Video[] = [];
  videosSinEquipamiento: Video[] = [];
  filteredItems: Video[] = [];
  selectedType: string = 'Todos';
  modalOpen: boolean = false;
  role!: string;
  searchTerm: string = '';
  loading: boolean = false;
  // Admin mode variable
  adminModeActivated: boolean = false;
  // Modal for create a video form
  createModal: boolean = false;
  editModal: boolean = false;
  deleteModal: boolean = false;
  // Variable para almacenar el video que se está editando
  editedVideo: Video = new Video;
  // Selected video to delete
  selectedVideo: Video | null = null;
  // Formulario de creación del video
  createVideoForm!: FormGroup;
  // Formulario de editar video
  editVideoForm!: FormGroup;

  constructor(private http: HttpService, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.loading = true;
    this.http.getRole().subscribe((response) => {
      this.role = response
    });
    this.http
      .getVideosModality(2, 1)
      .pipe(
        switchMap((videos) => {
          this.videosSaco = videos;
          this.todos = this.todos.concat(videos);
          this.filteredItems = [...this.todos];
          return of(videos);
        }),
        switchMap(() => {
          return this.http.getVideosModality(2, 2);
        }),
        tap((videos) => {
          this.videosPareja = videos;
          this.todos = this.todos.concat(videos);
          this.filteredItems = [...this.todos];
          return of(videos);
        }),
        switchMap(() => {
          return this.http.getVideosModality(2, 3);
        }),
        tap((videos) => {
          this.videosConEquipamiento = videos;
          this.todos = this.todos.concat(videos);
          this.filteredItems = [...this.todos];
          return of(videos);
        }),
        switchMap(() => {
          return this.http.getVideosModality(2, 4);
        }),
        tap((videos) => {
          this.videosSinEquipamiento = videos;
          this.todos = this.todos.concat(videos);
          this.filteredItems = [...this.todos];
          return videos;
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
    // Inicializa el formulario de edición con las validaciones requeridas
    this.editVideoForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/),
        Validators.maxLength(20),
        Validators.minLength(7)
      ]), // Título requerido
      coach: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9\s]+$/),
        Validators.minLength(5),
        Validators.maxLength(150)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(1000)
      ]),
      url: new FormControl('', [
        Validators.required,
        Validators.minLength(35),
        Validators.pattern(/^https:\/\/player\.vimeo\.com\/video\/\d+(\?.*)?$/)
      ]),
      duration: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9:]+$/),
        Validators.maxLength(6)
      ]),
      exclusive: new FormControl('', []),
    });
  }

  openModal() {
    this.modalOpen = true;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.modalOpen = false;
    document.body.classList.remove('modal-open');
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

  onFilteredItemsChanged(filteredItems: Video[]) {
    this.filteredItems = filteredItems;
  }

  filterVideos(type: string) {
    this.selectedType = type;

    switch (type) {
      case 'Todos':
        this.filteredItems = this.todos;
        break;
      case 'ConSaco':
        this.filteredItems = this.videosSaco;
        break;
      case 'ConPareja':
        this.filteredItems = this.videosPareja;
        break;
      case 'ConEquipamiento':
        this.filteredItems = this.videosConEquipamiento;
        break;
      case 'SinEquipamiento':
        this.filteredItems = this.videosSinEquipamiento;
        break;
      default:
        this.filteredItems = this.todos;
    }
  }

  toggleAdminMode() {
    this.adminModeActivated = !this.adminModeActivated;
  }

  /**
   *
   * @param video
   */
  editVideo(videoId: number) {
    const selectedVideo = this.todos.find(video => video.id === videoId)
    if (selectedVideo) {
      this.editedVideo = selectedVideo;
      // Actualizar los valores del formulario con los valores de la dieta seleccionada
      this.editVideoForm.patchValue({
        title: selectedVideo.title,
        coach: selectedVideo.coach,
        description: selectedVideo.description,
        url: selectedVideo.url,
        duration: selectedVideo.duration,
        exclusive: selectedVideo.exclusive
      });
      this.editModal = true;
    }
  }

  /**
   * Delete a video
   * @param video The video to delete
   */
  deleteVideo(video: Video) {
    // Implement logic to delete the video

    this.http.destroyVideo(video.id).subscribe(
      () => {
        // Remove the video from the local list if necessary
        this.filteredItems = this.filteredItems.filter(
          (item) => item.id !== video.id
        );
      },
      (error) => {
        console.error('Error deleting video:', error);
      }
    );
  }

  /**
   *
   */
  submitEditVideoForm() {
    // Actualizar editedVideo con los valores del formulario
    this.editedVideo.title = this.editVideoForm.get('title')?.value;
    this.editedVideo.coach = this.editVideoForm.get('coach')?.value;
    this.editedVideo.description = this.editVideoForm.get('description')?.value;
    this.editedVideo.url = this.editVideoForm.get('url')?.value;
    this.editedVideo.duration = this.editVideoForm.get('duration')?.value;
    this.editedVideo.exclusive = this.editVideoForm.get('exclusive')?.value;

    this.http.updateVideo(this.editedVideo.id, this.editedVideo).subscribe(
      (updatedVideo) => {
        //Actualizo el video en lista local
        const index = this.todos.findIndex(video => video.id === updatedVideo.id);
        if (index !== -1) {
          this.todos[index] = updatedVideo;
        }
        this.closeEditModal();
      },
      (error) => {
        console.error("Error al actualizar el Video:", error)
      }
    )
  }
  /**
   *
   */
  closeCreateModal() {
    if (this.createModal) {
      this.createModal = false;
    }
  }
  /**
   *
   */
  addVideo() {
    if (!this.createModal) {
      this.createModal = true;
    }
  }
  /**
   *
   */
  confirmDelete() {
    if (this.selectedVideo !== null) {
      this.http.destroyVideo(this.selectedVideo.id).subscribe(() => {
        this.todos = this.todos.filter(video => video.id !== this.selectedVideo?.id);
        this.selectedVideo = null;
        this.deleteModal = false;
      });
    }

  }
  /**
   *
   */
  cancelDelete() {
    this.selectedVideo = null;
    this.deleteModal = false;
  }

  /**
   *
   */
  closeEditModal() {
    // Limpia el video editado y cierra el modal
    this.editedVideo = new Video();
    this.editModal = false;
  }

  /**
  * Busca el video que se seleccione por ID para mostrar el modal
  *
  * @param video
  */
  openDeleteModal(video: Video) {
    this.selectedVideo = video;
    this.deleteModal = true;
  }

}
