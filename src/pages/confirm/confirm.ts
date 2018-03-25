import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { TodoServiceProvider } from "../../services/todos.service";

@IonicPage()
@Component({
  selector: "page-confirm",
  templateUrl: "confirm.html"
})
export class ConfirmPage {
  listUuid: string;
  itemUuid: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider
  ) {
    this.listUuid = this.navParams.get("listUuid");
    this.itemUuid = this.navParams.get("itemUuid");
  }

  deleteItem() {
    this.todoServiceProvider
      .deleteTodo(this.listUuid, this.itemUuid)
      .then(() => {
        this.navCtrl.pop();
      });
  }

  declineDelete() {
    this.navCtrl.pop()
  }
}
