import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth-component.component.html',
  styleUrls: ['./auth-component.component.scss']
})
export class AuthComponentComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {
    
  }

    async login() {
      await this.authService.login(this.username, this.password)
  }

  async signUp() {
    const success = await this.authService.signup(this.username, this.password)
    if (!success) {
      alert("Username already exists")
    }
  }

}
