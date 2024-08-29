import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  isGameStarted = false;
  playerQuantity = 0;
  form: FormGroup;

  currentPlayerNumber = 0;
  isWhite = false;
  currentWord = '';
  private wordList: String[] = [];
  
  constructor(private localService: LocalService, private changeDetectorRef: ChangeDetectorRef,
    private homeService: HomeService
  ){
    this.form = new FormGroup({
      quantity: new FormControl('', Validators.required) 
    });
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined'){
      const auxIsGameStarted = this.localService.getData('isGameStarted');
      const auxPlayerQuantity = this.localService.getData('playerQuantity');
      const auxCurrentWord = this.localService.getData('currentWord');
      if(auxIsGameStarted !== null && auxPlayerQuantity !== null && auxCurrentWord !== null){
        this.isGameStarted = Boolean(auxIsGameStarted);
        this.playerQuantity = Number(auxPlayerQuantity);
        this.currentWord = auxCurrentWord;
        this.generateWordList();
        this.currentPlayerNumber = 1;
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  private shuffle(array: String[]){
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }

  private generateWordList(){
    this.wordList = [];
    for(let i = 1; i < this.playerQuantity; i++){
      this.wordList.push(this.currentWord);
    }
    this.wordList.push('Impostor');
    this.wordList = this.shuffle(this.wordList);
    console.log('wordList shuffled', this.wordList);
  }

  startGame(){
    if(this.form.invalid){
      return;
    }

    this.isGameStarted = true;

    this.playerQuantity = Number(this.form.controls['quantity'].value);

    this.currentPlayerNumber = 1;
    this.isWhite = false;
    this.getNewWord();

    if(typeof window !== 'undefined'){
      this.localService.saveData('isGameStarted', String(this.isGameStarted));
      this.localService.saveData('playerQuantity', String(this.playerQuantity));
      this.localService.saveData('currentWord', String(this.currentWord));
    }
  }

  private getNewWord(){
    let generatedWord = '';

    do{
      const auxList = [...environment.wordList];
      const random = Math.floor(Math.random() * auxList.length);

      generatedWord = auxList[random];
    }while(this.currentWord === generatedWord);

    this.currentWord = generatedWord;
    this.generateWordList();
  }

  getPaper(): String{
    return this.wordList[this.currentPlayerNumber-1];
  }

  letsDraw(){
    this.isWhite = true;
  }

  nextPlayer(){
    this.currentPlayerNumber++;
    this.isWhite = false;
  }

  reportWord(){
    this.homeService.reportWord(this.currentWord);
    this.newWord();
  }

  newWord(){
    this.currentPlayerNumber = 1;
    this.isWhite = false;
    this.getNewWord();
  }

  mainMenu(){
    this.isGameStarted = false;
  }
}
