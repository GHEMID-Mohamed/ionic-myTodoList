import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { SpeechRecognition } from "@ionic-native/speech-recognition";
import { ChangeDetectorRef } from "@angular/core";

import { TodoServiceProvider } from "../../services/todos.service";

@IonicPage()
@Component({
  selector: "page-new-list",
  templateUrl: "new-list.html"
})
export class NewListPage {
  todoform: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public todoServiceProvider: TodoServiceProvider,
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef
  ) {
    this.todoform = this.formBuilder.group({
      title: ["", Validators.required]
    });
  }

  onAddList() {
    this.todoServiceProvider.AddList(this.todoform.value.title);
    this.navCtrl.pop()
  }

  private getPermission() {
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition
          .requestPermission()
          .then(() => console.log("Granted"), () => console.log("Denied"));
      } else {
        console.log("has permission");
      }
    });
  }

  private startListening() {
    let options = {
      language: "fr-FR"
    };
    this.getPermission();
    this.speechRecognition.startListening(options).subscribe(
      matches => {
        this.todoform.value.title(matches.pop());
        this.cd.detectChanges();
      },
      error => console.log(error)
    );
  }
}
