import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { TodoServiceProvider } from "../../services/todos.service";
import { NewTodoPage } from "../new-todo/new-todo";
import { TodoItem } from "../../models/TodoItem";

import firebase from "firebase";

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  name: string;
  listUuid: string;
  todoItems: TodoItem[];
  ref: any;
  RadioOpen: boolean;
  connexionMode: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController
  ) {
    this.name = this.navParams.get("name");
    this.listUuid = this.navParams.get("listUuid");

    let refLists = firebase.database().ref(`myLists/`);
    refLists.on("value", this.getTodos, this);
  }

  getTodos() {
    this.todoServiceProvider
      .getTodos(this.listUuid)
      .subscribe(todos => (this.todoItems = todos));
  }

  ionViewWillEnter() {
    this.getTodos();
  }

  openNewTodoPage() {
    this.navCtrl.push(NewTodoPage, {
      listUuid: this.listUuid,
      refreshTodos: this.getTodos()
    });
  }

  showShareMode(email: string) {
    let alert = this.alertCtrl.create();
    alert.setTitle("share mode");

    alert.addInput({
      type: "radio",
      label: "Copy",
      value: "copy",
      checked: false
    });

    alert.addInput({
      type: "radio",
      label: "Realtime share",
      value: "share",
      checked: true
    });

    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: modeShare => {
        this.todoServiceProvider
          .shareList(email, this.listUuid, this.name, modeShare)
          .then(listshared => {
            console.log(listshared)
            if (listshared) {
              let alert = this.alertCtrl.create({
                title: "List shared",
                subTitle: "Your list has been successfully shared",
                buttons: ["OK"]
              });
              alert.present();
            } else {
              let alert = this.alertCtrl.create({
                title: "Error",
                subTitle: "This user does not exit or it is not granted",
                buttons: ["OK"]
              });
              alert.present();
            }
          });
      }
    });
    alert.present();
  }

  shareList() {
    let prompt = this.alertCtrl.create({
      title: "Share list",
      message: "Enter the email of the user who you want to share this list",
      inputs: [
        {
          name: "email",
          placeholder: "user email"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {}
        },
        {
          text: "share",
          handler: data => {
            this.showShareMode(data.email);
          }
        }
      ]
    });
    prompt.present();
  }
}
