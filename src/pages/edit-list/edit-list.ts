import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { TodoItem } from "../../models/TodoItem";
import { TodoServiceProvider } from "../../services/todos.service";
import { SpeechRecognition } from "@ionic-native/speech-recognition";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "page-edit-list",
  templateUrl: "edit-list.html"
})
export class EditListPage {
  todoForm: any;
  listUuid: string;
  listName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private todoServiceProvider: TodoServiceProvider,
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef
  ) {
    this.listName = this.navParams.get("listName");
    this.listUuid = this.navParams.get("listUuid");

    this.todoForm = this.formBuilder.group({
      title: [this.listName, Validators.required]
    });
  }

  onEditTodo() {
    this.listName = this.todoForm.value.title;
    this.todoServiceProvider.editList(this.listName, this.listUuid);
    this.navCtrl.pop();
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
        this.todoForm.value.title(matches.pop());
        this.cd.detectChanges();
      },
      error => console.log(error)
    );
  }
}
