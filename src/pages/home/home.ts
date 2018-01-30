import { Component } from "@angular/core"
import { NavController, NavParams } from "ionic-angular"
import { ListPage } from "../list/list"
import { TodoList } from "../../model/model"

import { TodoServiceProvider } from "../../services/todos.service"

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  lists: TodoList[]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider
  ) {}

  ngOnInit() {
    this.todoServiceProvider.getList().subscribe(lists => (this.lists = lists))
  }

  onListSelected(uuid: string) {
    this.navCtrl.push(ListPage, {
      uuid: uuid
    })
  }
}
