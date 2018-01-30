import { Component } from "@angular/core"
import { IonicPage, NavController, NavParams } from "ionic-angular"
import { TodoServiceProvider } from "../../services/todos.service"
import { NewTodoPage } from "../new-todo/new-todo"
import { TodoItem } from "../../model/model"

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  uuid: string
  todoItems: TodoItem[]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider
  ) {
    this.uuid = this.navParams.get("uuid")
  }

  ngOnInit() {
    this.todoServiceProvider
      .getTodos(this.uuid)
      .subscribe(todos => (this.todoItems = todos))

      console.log(this.todoItems)
  }

  openNewTodoPage() {
    this.navCtrl.push(NewTodoPage)
  }

}
