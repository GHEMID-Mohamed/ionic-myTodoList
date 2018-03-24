import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { TodoServiceProvider } from "../../services/todos.service";
import { HomePage } from "../home/home";

@IonicPage()
@Component({
  selector: "page-shared-lists",
  templateUrl: "shared-lists.html"
})
export class SharedListsPage {
  sharedLists: Array<object> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController
  ) {}

  getSharedLists() {
    this.todoServiceProvider.getSharedLists().subscribe(lists => {
      this.sharedLists = lists;
    });
  }

  acceptList(list) {
    this.todoServiceProvider.acceptSharedList(list).then(() => {
      this.navCtrl.push(HomePage);
    });
  }

  declineList(list) {
    let confirm = this.alertCtrl.create({
      title: "Decline list",
      message: "Are sure you want to decline this list ?",
      buttons: [
        {
          text: "Disagree",
          handler: () => {
            console.log("Disagree clicked");
          }
        },
        {
          text: "Agree",
          handler: () => {
            this.todoServiceProvider.declineSharedList(list);
          }
        }
      ]
    });
    confirm.present();
  }

  ionViewWillEnter() {
    this.getSharedLists();
  }
}
