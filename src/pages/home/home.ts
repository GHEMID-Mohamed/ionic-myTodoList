import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  MenuController,
  ActionSheetController
} from "ionic-angular";
import { ListPage } from "../list/list";
import { TodoList } from "../../models/TodoList";
import { AngularFireAuth } from "angularfire2/auth";
import { NewListPage } from "../new-list/new-list";
import { EditListPage } from "../edit-list/edit-list";

import { generateId } from "../../utils";
import firebase from "firebase";

import { TodoServiceProvider } from "../../services/todos.service";
import { ProfilPage } from "../profil/profil";
import { Toast } from "@ionic-native/toast";

import "rxjs/Rx";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
  providers: [Toast]
})
export class HomePage {
  lists: TodoList[] = [];
  listsPending: boolean = true;

  constructor(
    public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController,
    public toast: Toast,
    menu: MenuController,
    public actionSheetCtrl: ActionSheetController
  ) {
    menu.enable(true);
  }

  getLists() {
    this.listsPending = true;
    this.todoServiceProvider.getList().subscribe(lists => {
      this.lists = lists;
      this.listsPending = false;
    });
  }

  ionViewWillEnter() {
    this.getLists();
  }

  onListSelected(list: TodoList) {
    this.navCtrl.push(ListPage, {
      name: list.name,
      listUuid: list.uuid
    });
  }

  onAddList() {
    let prompt = this.alertCtrl.create({
      title: "Add list",
      message: "Enter the name of the new list",
      inputs: [
        {
          name: "title",
          placeholder: "Title"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {}
        },
        {
          text: "Add",
          handler: data => {
            this.todoServiceProvider.AddList(data.title);
          }
        }
      ]
    });
    prompt.present();
  }

  onEditList(listUuid: string, listName: string) {
    this.navCtrl.push(EditListPage, {
      listUuid,
      listName
    });
  }

  onSeeProfile() {
    const user = this.afAuth.auth.currentUser;
    if (user) {
      this.navCtrl.push(ProfilPage, {
        user: user
      });
    }
  }

  onDeleteList(uuid: string) {
    let confirm = this.alertCtrl.create({
      title: "Delete item",
      message: "Are sure you want to delete this item?",
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
            this.todoServiceProvider.deleteList(uuid);
          }
        }
      ]
    });
    confirm.present();
  }

  presentActionSheet(listUuid: string, name: string) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "List options",
      buttons: [
        {
          text: "Edit",
          role: "destructive",
          handler: () => {
            this.onEditList(listUuid, name);
          },
          icon: "create"
        },
        {
          text: "Share",
          role: "destructive",
          handler: () => {
            this.shareList(listUuid, name);
          },
          icon: "share"
        },
        {
          text: "Delete",
          role: "destructive",
          handler: () => {
            this.onDeleteList(listUuid);
          },
          icon: "trash"
        }
      ]
    });

    actionSheet.present();
  }

  showShareMode(email: string, listUuid: string, name: string) {
    let alert = this.alertCtrl.create();
    alert.setTitle("share mode");

    alert.addInput({
      type: "radio",
      label: "Copy",
      value: "copy",
      checked: false
    });

    alert.addInput({
      type: "radio",
      label: "Realtime share",
      value: "share",
      checked: true
    });

    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: modeShare => {
        this.todoServiceProvider
          .shareList(email, listUuid, name, modeShare)
          .then(listshared => {
            console.log(listshared);
            if (listshared) {
              let alert = this.alertCtrl.create({
                title: "List shared",
                subTitle: "Your list has been successfully shared",
                buttons: ["OK"]
              });
              alert.present();
            } else {
              let alert = this.alertCtrl.create({
                title: "Error",
                subTitle: "This user does not exit or it is not granted",
                buttons: ["OK"]
              });
              alert.present();
            }
          });
      }
    });
    alert.present();
  }

  shareList(listUuid: string, name: string) {
    let prompt = this.alertCtrl.create({
      title: "Share list",
      message: "Enter the email of the user who you want to share this list",
      inputs: [
        {
          name: "email",
          placeholder: "user email"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {}
        },
        {
          text: "share",
          handler: data => {
            this.showShareMode(data.email, listUuid, name);
          }
        }
      ]
    });
    prompt.present();
  }

  openNewList() {
    this.navCtrl.push(NewListPage);
  }
}
