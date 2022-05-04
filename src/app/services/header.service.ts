import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SocialData } from '../interfaces/HeaderInterfaces';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {


  private apiUrl = environment.apiUrl + 'socials';

  constructor(
    private http: HttpClient
  ) { }

  getSocialData(): Observable<SocialData[]>{
    return this.http.get<SocialData[]>(this.apiUrl);
  }

  createNewSocial(formData: FormData): Observable<SocialData>{
    return this.http.post<SocialData>(this.apiUrl, formData);
  }

  deleteSocial(social: SocialData): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${social.id}`)
  }

}
