import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Video } from 'src/app/models/Video';
import { Router } from '@angular/router';
import { finalize, of, switchMap, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-fitnessvideo',
  templateUrl: './fitnessvideo.component.html',
  styleUrls: ['./fitnessvideo.component.css'],
})
export class FitnessvideoComponent implements OnInit {
  // Arreglo para almacenar los videos
  todos: Video[] = [];
  videosConEquipamiento: Video[] = [];
  videosSinEquipamiento: Video[] = [];
  filteredItems: Video[] = [];
  selectedType: string = 'Todos';
  modalOpen: boolean = false;
  loading: boolean = false;
  role!: string;
  editingVideo: Video | null = null;

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
  editForm!: FormGroup;

  /**
   *
   * @param http
   * @param router
   * @param auth
   */
  constructor(
    private http: HttpService,
    private router: Router,
    private auth: AuthService
  ) {

    this.editForm = new FormGroup({
      title: new FormControl('', Validators.required),
      coach: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    // Formulario de creación de video
    this.createVideoForm = new FormGroup({
      videoTitle: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9\s]*$/) // Texto y numeros
      ]),
      videoCoach: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/) // Texto
      ]),
      videoDescription: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9\s.ñÑ]*$/) // String,ñ
      ]),
      videoUrl: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,5}([/?#].*)?$/)
      ]),
      videoDuration: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9\s:.]*$/), // String
      ]),
      videoExclusive: new FormControl('', [
        Validators.required
      ]),
    })
  }

  ngOnInit(): void {
    this.loading = true;
    this.http.getRole().subscribe((response) => {
      this.role = response
    });
    this.http
      .getVideosModality(3, 3)
      .pipe(
        switchMap((videos) => {
          this.videosConEquipamiento = videos;
          this.todos = this.todos.concat(videos);
          this.filteredItems = [...this.todos];

          return of(videos);
        }),
        switchMap(() => {
          return this.http.getVideosModality(3, 4);
        }),
        tap((videos) => {
          if (videos) {
            this.videosSinEquipamiento = videos;
            this.todos = this.todos.concat(videos);
            this.filteredItems = [...this.todos];
          }
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();


  }


  // Método que se ejecutará cuando cambien los elementos filtrados
  onFilteredItemsChanged(filteredItems: Video[]) {
    this.filteredItems = filteredItems;
  }
  /**
   *
   * @param type
   */
  filterVideos(type: string) {
    this.selectedType = type;

    switch (type) {
      case 'Todos':
        this.filteredItems = this.todos;
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
   *
   *
   */

  /**
  *
  */
  submitCreateVideoForm() {
    if (this.createVideoForm.valid) {
      const newVideo = {
        title: this.createVideoForm.value.videoTitle,
        coach: this.createVideoForm.value.videoCoach,
        description: this.createVideoForm.value.videoDescription,
        url: this.createVideoForm.value.videoUrl,
        duration: this.createVideoForm.value.videoDuration,
        exclusive: this.createVideoForm.value.videoExclusive
      };
    }
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
* Busca el video que se seleccione por ID para mostrar el modal
*
* @param video
*/
  openDeleteModal(video: Video) {
    this.selectedVideo = video;
    this.deleteModal = true;
  }

  /**
 *
 * @param video
 */
  editVideo(videoId: number) {
    const selectedVideo = this.todos.find(video => video.id === videoId)
    if (selectedVideo) {
      this.editedVideo = selectedVideo; // Asignar directamente el video seleccionado
      this.editModal = true;
    }

  }

  /**
   * Clean editedVideo & close edit modal
   */
  closeEditModal() {
    // Limpia el video editado y cierra el modal
    this.editedVideo = new Video();
    this.editModal = false;
  }

  /**
   * Submit edit form
   */
  submitEditForm() {
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
  addVideo() {
    if (!this.createModal) {
      this.createModal = true;
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
    // Check if video is exclusive and user role permits access
    if (video.exclusive && this.role != 'Standard' && this.role != 'Premium') {
      // Open modal if access is restricted
      this.openModal();
    } else {
      // Navigate to video player if access is permitted
      this.router.navigate(['/player', video.id]);
    }
  }
}
