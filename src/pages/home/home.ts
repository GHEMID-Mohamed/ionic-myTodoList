import { Component } from "@angular/core"
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular"
import { ListPage } from "../list/list"
import { TodoList } from "../../models/TodoList"

import { TodoServiceProvider } from "../../services/todos.service"

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  lists: TodoList[]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.todoServiceProvider.getList().subscribe(lists => (this.lists = lists))
  }

  onListSelected(list: TodoList) {
    this.navCtrl.push(ListPage, {
      name: list.name,
      listUuid: list.uuid
    })
  }

  onAddList() {
    let prompt = this.alertCtrl.create({
      title: "Add list",
      message: "Enter the name of the new list",
      inputs: [
        {
          name: "title",
          placeholder: "Title"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {}
        },
        {
          text: "Add",
          handler: data => {
            this.todoServiceProvider.AddList(data.title)
          }
        }
      ]
    })
    prompt.present()
  }
}
