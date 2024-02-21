import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  token: string = '';
  constructor(private authService: AuthService) {
    this.token = this.authService.token
    if (this.token) {
      
    } 
  }

}
