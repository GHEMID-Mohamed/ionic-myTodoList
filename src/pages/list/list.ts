import { Component } from "@angular/core"
import { IonicPage, NavController, NavParams } from "ionic-angular"
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
    public todoServiceProvider: TodoServiceProvider
  ) {
    this.name = this.navParams.get("name")
    this.listUuid = this.navParams.get("listUuid")

    this.ref = firebase.database().ref("myLists/")
    this.ref.on("value", this.updateData, this)
  }

  updateData(snap) {
    this.todoServiceProvider.convertData(snap)
    this.todoServiceProvider
      .getTodos(this.listUuid)
      .subscribe(todos =>{
        console.log(todos)
        this.todoItems = todos
      } )
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
}
