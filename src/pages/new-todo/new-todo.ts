import { Component } from "@angular/core"
import { NavController, NavParams } from "ionic-angular"
import { TodoServiceProvider } from "../../services/todos.service"
import { Validators, FormBuilder, FormGroup } from "@angular/forms"
import { TodoItem } from "../../models/TodoItem"
import { generateId } from "../../utils"
import { SpeechRecognition } from "@ionic-native/speech-recognition";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "page-new-todo",
  templateUrl: "new-todo.html"
})
export class NewTodoPage {
  todoform: any
  listUuid: string
  todoItem: TodoItem = { name: "", complete: false, desc: "", uuid: "" }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    private formBuilder: FormBuilder,
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef
  ) {
    this.todoform = this.formBuilder.group({
      title: ["", Validators.required],
      description: [""]
    })
    this.listUuid = navParams.get("listUuid")
  }

  onAddTodo() {
    this.todoItem.name = this.todoform.value.title
    this.todoItem.desc = this.todoform.value.description
    this.todoItem.complete = false
    this.todoItem.uuid = generateId()
    this.todoServiceProvider.addTodo(this.listUuid, this.todoItem)
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
        this.todoform.controls['title'].setValue(matches.pop());
        this.cd.detectChanges();
      },
      error => console.log(error)
    );
  }
}