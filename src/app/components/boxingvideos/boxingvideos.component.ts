import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Video } from 'src/app/models/Video';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, of, switchMap, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-boxingvideos',
  templateUrl: './boxingvideos.component.html',
  styleUrls: ['./boxingvideos.component.css'],
})
export class BoxingvideosComponent implements OnInit {
  todos: Video[] = [];  // List of all videos
  videosSaco: Video[] = [];  // Videos with punching bag
  videosPareja: Video[] = [];  // Partner videos
  videosConEquipamiento: Video[] = [];  // Videos with equipment
  videosSinEquipamiento: Video[] = [];  // Videos without equipment
  editingVideo: Video | null = null;  // Currently editing video
  loading: boolean = false;  // Loading indicator
  adminModeActivated: boolean = false;  // Admin mode indicator
  filteredItems: Video[] = [];  // Filtered list of videos
  selectedType: string = 'Todos';  // Selected video type for filtering
  modalOpen: boolean = false;  // Modal open indicator
  role!: string;  // User role
  editForm: FormGroup;  // Form for editing video details
  createModal: boolean = false;  // Create modal open indicator
  editModal: boolean = false;  // Edit modal open indicator
  deleteModal: boolean = false;  // Delete modal open indicator
  editedVideo: Video = new Video();  // Video being edited
  selectedVideo: Video | null = null;  // Video selected for deletion
  createVideoForm!: FormGroup;  // Form for creating a new video
  editVideoForm!: FormGroup; // Formulario de editar video

  constructor(private http: HttpService, private router: Router, private auth: AuthService) {
    this.editForm = new FormGroup({
      title: new FormControl('', Validators.required),
      coach: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
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

  /**
   * Lifecycle hook for component initialization
   */
  ngOnInit(): void {
    this.http.getRole().subscribe((response) => {
      this.role = response
    });

    // Set loading flag to true
    this.loading = true;

    // Fetch videos for each modality
    this.http
      .getVideosModality(1, 1)
      .pipe(
        switchMap((videos) => {

          this.videosSaco = videos;
          this.todos = this.todos.concat(videos);
          this.filteredItems = [...this.todos];

          // Return the fetched videos
          return of(videos);
        }),
        switchMap(() => {
          return this.http.getVideosModality(1, 2);
        }),
        tap((videos) => {
          this.videosPareja = videos;
          this.todos = this.todos.concat(videos);
          this.filteredItems = [...this.todos];
          return of(videos);
        }),
        switchMap(() => {
          return this.http.getVideosModality(1, 3);
        }),
        tap((videos) => {
          this.videosConEquipamiento = videos;
          this.todos = this.todos.concat(videos);
          this.filteredItems = [...this.todos];
          return of(videos);
        }),
        switchMap(() => {
          return this.http.getVideosModality(1, 4);
        }),
        tap((videos) => {
          this.videosSinEquipamiento = videos;
          this.todos = this.todos.concat(videos);
          this.filteredItems = [...this.todos];
          return videos;
        }),

        // Set loading flag to false after all requests are completed
        finalize(() => (this.loading = false))
      )

      // Subscribe to the observable
      .subscribe();

  }

  /**
   * Toggle admin mode
   */
  toggleAdminMode() {
    this.adminModeActivated = !this.adminModeActivated;
  }


  /**
   * Open modal video premium
   */
  openModal() {
    this.modalOpen = true;
    document.body.classList.add('modal-open');
  }

  /**
   * Close modal dialog
   */
  closeModal() {
    this.modalOpen = false;
    document.body.classList.remove('modal-open');
  }

  /**
   * Select a video to play
   * @param video The selected video
   */
  selectVideo(video: Video) {
    if (video.exclusive && this.role != 'Standard' && this.role != 'Premium' && this.role != 'Admin') {
      this.openModal();
      // Abre el modal si el video es premium y el usuario no tiene un rol premium
    } else {
      this.router.navigate(['/player', video.id]);
      // Navega al componente de reproductor si el usuario tiene permiso para ver el video
    }
  }


  /**
   * Handle change in filtered items
   * @param filteredItems The filtered video items
   */
  onFilteredItemsChanged(filteredItems: Video[]) {
    this.filteredItems = filteredItems;
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
   * Close edit modal
   */
  closeEditModal() {
    // Limpia el video editado y cierra el modal
    this.editedVideo = new Video();
    this.editModal = false;
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
   * Filter videos by type
   * @param type The type of videos to filter
   */
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

  /**
   * Close create modal
   */
  closeCreateModal() {
    this.createModal = false;
  }


  /**
   * Submit edit form
   */
  submitEditVideoForm() {
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
   * Cancel delete operation
   */
  cancelDelete() {
    this.selectedVideo = null;
    this.deleteModal = false;
  }

  /**
   * Confirm delete operation
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
  * Open delete modal for selected video
  * @param video The selected video
  */
  openDeleteModal(video: Video) {
    this.selectedVideo = video;
    this.deleteModal = true;
  }

}
