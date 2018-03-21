import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  MenuController
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
    public alertCtrl: AlertController,
    menu: MenuController
  ) {
    menu.enable(true);

    this.name = this.navParams.get("name");
    this.listUuid = this.navParams.get("listUuid");
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
}
