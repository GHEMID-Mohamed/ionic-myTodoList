import { Component } from "@angular/core"
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular"
import { TodoServiceProvider } from "../../services/todos.service"
import { NewTodoPage } from "../new-todo/new-todo"
import { TodoItem } from "../../models/TodoItem"

import firebase from "firebase"

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  name: string
  listUuid: string
  todoItems: TodoItem[]
  ref: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController
  ) {
    this.name = this.navParams.get("name")
    this.listUuid = this.navParams.get("listUuid")

    this.todoServiceProvider.listenUser()
  }

  ionViewWillEnter() {
    this.todoServiceProvider
      .getTodos(this.listUuid)
      .subscribe(todos => (this.todoItems = todos))
  }

  openNewTodoPage() {
    this.navCtrl.push(NewTodoPage, {
      listUuid: this.listUuid
    })
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
            this.todoServiceProvider
              .shareList(data.email, this.listUuid, this.name)
              .then(listshared => {
                if (listshared) {
                  let alert = this.alertCtrl.create({
                    title: "List shared",
                    subTitle: "Your list has been successfully shared",
                    buttons: ["OK"]
                  })
                  alert.present()
                } else {
                  let alert = this.alertCtrl.create({
                    title: "Error",
                    subTitle: "This user does not exit or it is not granted",
                    buttons: ["OK"]
                  })
                  alert.present()
                }
              })
          }
        }
      ]
    })
    prompt.present()
  }
}
