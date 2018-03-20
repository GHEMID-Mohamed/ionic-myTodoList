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
import { SpeechRecognition } from "@ionic-native/speech-recognition";
import { ChangeDetectorRef } from "@angular/core";

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
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef,
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

  private getPermission() {
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition
          .requestPermission()
          .then(() => console.log("Granted"), () => console.log("Denied"));
      } else {
        console.log("has permission");
      }
    });
  }

  private startListening() {
    let options = {
      language: "fr-FR"
    };

    //get permission
    this.getPermission();
    this.speechRecognition.startListening(options).subscribe(
      matches => {
        this.todoServiceProvider.AddList(matches.pop());
        this.cd.detectChanges();
      },
      error => console.log(error)
    );
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
          text: "listen",
          handler: data => {
            this.startListening();
          }
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

  onEditList(listUuid: string) {
    let prompt = this.alertCtrl.create({
      title: "Edit list",
      message: "Enter the new name of the list",
      inputs: [
        {
          name: "name",
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
            this.todoServiceProvider.editList(data.name, listUuid);
          }
        }
      ]
    });
    prompt.present();
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

  presentActionSheet(listUuid: string) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "List options",
      buttons: [
        {
          text: "Edit",
          role: "destructive",
          handler: () => {
            this.onEditList(listUuid);
          },
          icon: "create"
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
}
