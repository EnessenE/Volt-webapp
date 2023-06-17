import { Injectable } from '@angular/core';
import { Chat } from '../classes/chat';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  endpoint: string = environment.apiServer + '/v1/chat';

  constructor(private http: HttpClient, private authService: AuthService) { }

  GetUserChats(): Observable<Chat[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'bearer ' + this.authService.token);

    return this.http.get<Chat[]>(`${this.endpoint}/mine`, { headers: headers })
  }
}
