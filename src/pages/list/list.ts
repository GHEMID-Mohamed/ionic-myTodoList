import { Component } from "@angular/core"
import { IonicPage, NavController, NavParams } from "ionic-angular"
import { TodosService } from "../../services/todos.service"
import { NewTodoPage } from "../new-todo/new-todo"

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  nom: string
  todos: { title: string; description: string; state: boolean }[] = []

  itemData: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todosService: TodosService
  ) {}

  openNewTodoPage() {
    this.navCtrl.push(NewTodoPage)
  }

  ionViewWillEnter() {
    this.todos = this.todosService.getTodos()
    console.log(this.todos)
  }
}
