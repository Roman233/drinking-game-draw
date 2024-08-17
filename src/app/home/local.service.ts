import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  public saveData(key: string, value: string) {
    console.log('saveData', key, value);
    localStorage.setItem(key, value);
  }

  public getData(key: string) {
    console.log('getData', key, localStorage.getItem(key));
    return localStorage.getItem(key);
  }
}
