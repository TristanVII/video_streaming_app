import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

const URL = 'http://localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  token = '';
  user = '';
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token') || '';
  }

  async login(
    username: string,
    password: string,
    token?: string | undefined
  ): Promise<boolean> {
    let body = { username: username, password: password, token: token };
    let request;
    try {
      request = await firstValueFrom(this.http.post<any>(`${URL}/login`, body));
    } catch (e) {
      this.isAuthenticatedSubject.next(false);
      return false;
    }
    if ('token' in request) {
      this.setToken(request.token);
    }
    this.user = body.username;
    this.isAuthenticatedSubject.next(true);
    return true;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async signup(username: string, password: string): Promise<boolean> {
    let body = { username: username, password: password };
    let request;
    try {
      request = await firstValueFrom(
        this.http.post<any>(`${URL}/signup`, body)
      );
    } catch (e) {
      this.isAuthenticatedSubject.next(false);
      return false;
    }
    return true;
  }

  // Getter method to retrieve current authentication status
  public get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}