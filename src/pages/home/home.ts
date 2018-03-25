import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  MenuController,
  ActionSheetController
} from "ionic-angular";
import firebase from "firebase";
import { ListPage } from "../list/list";
import { TodoList } from "../../models/TodoList";
import { AngularFireAuth } from "angularfire2/auth";
import { NewListPage } from "../new-list/new-list";
import { EditListPage } from "../edit-list/edit-list";
import { generateId } from "../../utils";
import { GooglePlus } from "@ionic-native/google-plus";
import { TodoServiceProvider } from "../../services/todos.service";
import { ProfilPage } from "../profil/profil";
import { Toast } from "@ionic-native/toast";
import { SharedListsPage } from "../shared-lists/shared-lists";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";

import "rxjs/Rx";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
  providers: [Toast, GooglePlus]
})
export class HomePage {
  lists: TodoList[];
  listsPending: boolean = true;
  sharedLists: any = [];
  notification: boolean = true;

  constructor(
    public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController,
    public toast: Toast,
    public menu: MenuController,
    public actionSheetCtrl: ActionSheetController,
    public googlePlus: GooglePlus,
    private barcodeScanner: BarcodeScanner
  ) {
    menu.enable(true);
  }

  onNotificationCLick() {
    this.notification = false;
    this.navCtrl.push(SharedListsPage);
  }

  getLists() {
    this.listsPending = true;
    this.todoServiceProvider.getList().subscribe(lists => {
      this.lists = lists;
      this.listsPending = false;
      this.getSharedLists();
    });
  }

  getSharedLists() {
    this.todoServiceProvider.getSharedLists().subscribe(lists => {
      this.sharedLists = lists;
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
          handler: async data => {
            const state = await this.todoServiceProvider.AddList(data.title);
            if (!state) {
              let alert = this.alertCtrl.create({
                title: "New list!",
                subTitle: "This list already exists!",
                buttons: ["OK"]
              });
              alert.present();
            }
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
            this.showShareMode(listUuid, name);
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

  showShareMode(listUuid: string, name: string) {
    let alert = this.alertCtrl.create();
    alert.setTitle("share mode");

    alert.addInput({
      type: "radio",
      label: "Share with E-mail",
      value: "email",
      checked: true
    });

    alert.addInput({
      type: "radio",
      label: "Share with QrCode",
      value: "qrcode",
      checked: false
    });

    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: modeShare => {
        if (modeShare === "email") {
          this.shareListWithEmail(listUuid, name, modeShare);
        } else if (modeShare === "qrcode") {
          this.barcodeScanner.encode("TEXT_TYPE", listUuid);
        }
      }
    });
    alert.present();
  }

  shareListWithEmail(listUuid: string, name: string, modeShare: string) {
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
            this.todoServiceProvider
              .shareList(data.email, listUuid, name, modeShare)
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
        }
      ]
    });
    prompt.present();
  }

  openNewList() {
    this.navCtrl.push(NewListPage);
  }

  onSeeSharedLists() {
    this.navCtrl.push(SharedListsPage);
  }

  scanBarCode() {
    const userId = this.todoServiceProvider.getUserId();

    this.barcodeScanner
      .scan()
      .then(async listUuidShared => {
        const listName = await this.todoServiceProvider.getNameList(
          listUuidShared.text
        );
        
        firebase
          .database()
          .ref(`users/${userId}/lists/${listUuidShared.text}`)
          .set({
            name: listName
          });
      })
      .catch(err => {
        console.log("Error", err);
      });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.navCtrl.popToRoot();
    });
  }
}
