import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AuthService } from './auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'upload-front-end';
  token = "";
  authenticated!: Observable<boolean>
  loading = true;
  constructor(private authService: AuthService, private route: ActivatedRoute){}

  async ngOnInit(): Promise<void> {
    console.log("token", this.authService.token)
    const params = this.route.snapshot.queryParamMap;
    
    // Access specific query parameters by name
    const param1 = params.get('token');
    if (param1) {
      this.authService.setToken(param1)
    }
    if (this.authService.token) {
      await this.authService.login('', '', this.authService.token)
    }
    this.authenticated = this.authService.isAuthenticated
    this.loading = false;
    
  }
}
