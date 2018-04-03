import { Component, Pipe, PipeTransform } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  MenuController,
  ActionSheetController
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
  todoItems: Array<TodoItem> = [];
  ref: any;
  RadioOpen: boolean;
  connexionMode: string;
  filterIteratee: boolean = undefined;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController,
    menu: MenuController,
    public actionSheetCtrl: ActionSheetController
  ) {
    menu.enable(true);

    this.name = this.navParams.get("name");
    this.listUuid = this.navParams.get("listUuid");
  }

  getTodos() {
    this.todoServiceProvider.getTodos(this.listUuid).subscribe(todos => {
      this.todoItems = todos;
    });
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

  filter() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Filter",
      buttons: [
        {
          text: "None",
          role: "destructive",
          handler: () => {
            this.filterIteratee = undefined;
          },
          icon: "md-close-circle"
        },
        {
          text: "Completed",
          role: "destructive",
          handler: () => {
            this.filterIteratee = true;
          },
          icon: "md-checkmark-circle"
        },
        {
          text: "Uncompleted",
          role: "destructive",
          handler: () => {
            this.filterIteratee = false;
          },
          icon: "md-close-circle"
        }
      ]
    });

    actionSheet.present();
  }
}
