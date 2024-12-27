import { Component } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { ProfileMenuService } from 'src/app/services/profile-menu-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  // Opción seleccionada del menú
  selectedOption: string = "";
  showUploadButton = false;

  constructor(public auth: AuthService, private selectedMenuOption: ProfileMenuService) { }
  ngOnInit() {
    this.selectedMenuOption.selectedOptionService.subscribe(option => {
      this.selectedOption = option;
    });
  }
}
