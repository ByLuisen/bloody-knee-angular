import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Video } from 'src/app/models/Video';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {

  @Input() todos: Video[] = []; // Recibe el array de todos los videos como entrada desde el componente padre

  @Output() filteredItemsChanged: EventEmitter<Video[]> = new EventEmitter<Video[]>(); // Emite los elementos filtrados al componente padre

  searchTerm: string = '';

  constructor() { }

  // Esta función filtra los videos basados en el término de búsqueda
  filterVideos() {
    const filteredItems = this.todos.filter(video =>
      video.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredItemsChanged.emit(filteredItems); // Emite los elementos filtrados al componente padre
  }
}
