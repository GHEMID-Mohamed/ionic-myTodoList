import { Component } from "@angular/core"
import { NavController, NavParams } from "ionic-angular"
import { ListPage } from "../list/list"

import { TodosService } from "../../services/todos.service"

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  lists: {
    nom: string
    todos: { title: string; description: string; state: boolean }[]
  }[] = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoService: TodosService
  ) {}

  onListSelected(nomList) {
    this.navCtrl.push(ListPage, {
      nom: nomList
    })
  }
}
