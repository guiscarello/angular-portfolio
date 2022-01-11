import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocialData } from '../interfaces/HeaderInterfaces';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {

  private apiUrl = 'http://localhost:5000/social';

  constructor(
    private http: HttpClient
  ) { }

  getSocialData(): Observable<SocialData[]>{
    return this.http.get<SocialData[]>(this.apiUrl);
  }

}
