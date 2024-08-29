import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  reportWord(word: String){
    this.http.post(environment.apiUrl + '/remove-word', {word: word}).subscribe({
      next: () => {
        console.log('Report sent!');
      },
      error: (err) => {
        console.log('Error sending report: ', err);
      }
    })
  }
}
