import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SocialData } from '../interfaces/HeaderInterfaces';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {

  private apiUrl = environment.apiUrl + 'social';

  constructor(
    private http: HttpClient
  ) { }

  getSocialData(): Observable<SocialData[]>{
    return this.http.get<SocialData[]>(this.apiUrl);
  }

}
