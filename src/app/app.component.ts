import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  word: string = "";
  originalWord: string = "";
  wordTry: string = "";
  userTrys = [];

  constructor(public http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any>("https://api.dicionario-aberto.net/random")
      .subscribe((result) => {
        this.originalWord = result.word;
        this.word = this.replaceSpecialChars(this.originalWord.toLowerCase());
      });
  }

  sendWord() {
    this.wordTry = this.replaceSpecialChars(this.wordTry.toLowerCase());
    if (this.word === this.wordTry) {
      alert("parabens você acertou, sua palavra é " + this.originalWord);
      return;
    }
    if (this.wordTry.length !== this.word.length) {
      alert("sua palavra deve ter " + this.word.length + " caracteres");
      return;
    }
    this.http
      .get<any>("https://api.dicionario-aberto.net/word/" + this.wordTry)
      .subscribe((result) => {
        if (result.length === 0) {
          alert("esta palavra não existe");
          return;
        }
        const wordData = [];
        for (let i = 0; i < this.word.length; i++) {
          if (this.word.includes(this.wordTry[i])) {
            if (this.word[i] === this.wordTry[i]) {
              wordData.push({ letter: this.wordTry[i], class: "green" });
            } else {
              wordData.push({ letter: this.wordTry[i], class: "yellow" });
            }
          } else {
            wordData.push({ letter: this.wordTry[i], class: "red" });
          }
        }
        this.userTrys.push({ word: this.wordTry, data: wordData });
        console.log(this.userTrys);
        this.wordTry = "";
      });
  }

  replaceSpecialChars(str) {
    str = str.replace(/[àáâãäå]/, "a");
    str = str.replace(/[íì]/, "i");
    str = str.replace(/[úùü]/, "u");
    str = str.replace(/[óòô]/, "o");
    return (str = str.replace(/[éèê]/, "e"));
  }

  showAnswer() {
    alert(this.originalWord);
  }
}
