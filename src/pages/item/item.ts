import { Component, Input } from "@angular/core"
import { EditTodoPage } from "../edit-todo/edit-todo"
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular"
import { TodoServiceProvider } from "../../services/todos.service"

@Component({
  selector: "item-todo",
  templateUrl: "item.html"
})
export class Item {
  @Input("itemData") itemData
  @Input("listUuid") listUuid

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController
  ) {}

  onEdit(uuid: string) {
    this.navCtrl.push(EditTodoPage, {
      listUuid: this.listUuid,
      todoItem: this.itemData
    })
  }

  onDelete() {
    let confirm = this.alertCtrl.create({
      title: "Delete item",
      message: "Are sure you want to delete this item?",
      buttons: [
        {
          text: "Disagree",
          handler: () => {
            console.log("Disagree clicked")
          }
        },
        {
          text: "Agree",
          handler: () => {
            this.todoServiceProvider.deleteTodo(
              this.listUuid,
              this.itemData.uuid
            )
          }
        }
      ]
    })
    confirm.present()
  }
}
