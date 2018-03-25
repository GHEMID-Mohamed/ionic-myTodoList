import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
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
    private cd: ChangeDetectorRef,
    public alertCtrl: AlertController
  ) {
    this.todoform = this.formBuilder.group({
      title: ["", Validators.required]
    });
  }

  async onAddList() {
    const state = await this.todoServiceProvider.AddList(
      this.todoform.value.title
    );
    if (!state) {
      let alert = this.alertCtrl.create({
        title: "New list!",
        subTitle: "This list already exists!",
        buttons: ["OK"]
      });
      alert.present();
    } else {
      this.navCtrl.pop();
    }
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
        this.todoform.controls["title"].setValue(matches.pop());
        this.cd.detectChanges();
      },
      error => console.log(error)
    );
  }
}
