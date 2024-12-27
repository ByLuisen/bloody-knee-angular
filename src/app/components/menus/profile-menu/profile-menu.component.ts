import { Component } from '@angular/core';
import { ProfileMenuService } from 'src/app/services/profile-menu-service.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class PerfileMenuComponent {
  constructor(private selectedOptionService: ProfileMenuService) { }

  selectMenuOption(option: string) {
    this.selectedOptionService.updateSelectedOption(option);
  }
}
