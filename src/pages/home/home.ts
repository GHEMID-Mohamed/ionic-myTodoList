import { Component } from "@angular/core"
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular"
import { ListPage } from "../list/list"
import { TodoList } from "../../models/TodoList"
import { AngularFireAuth } from "angularfire2/auth"

import { generateId } from "../../utils"
import firebase from "firebase"

import { TodoServiceProvider } from "../../services/todos.service"
import { ProfilPage } from "../profil/profil"

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  lists: TodoList[] = []
  ref: any

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController
  ) {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (!user) {
        this.navCtrl.popToRoot()
      }
    })

    this.todoServiceProvider.listenUser()
  }

  ionViewWillEnter() {
    this.todoServiceProvider.getList().subscribe(lists => {
      this.lists = lists
    })
  }

  onListSelected(list: TodoList) {
    this.navCtrl.push(ListPage, {
      name: list.name,
      listUuid: list.uuid
    })
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
            this.todoServiceProvider.AddList(data.title)
          }
        }
      ]
    })
    prompt.present()
  }

  onSeeProfile() {
    const user = this.afAuth.auth.currentUser
    if (user) {
      this.navCtrl.push(ProfilPage, {
        user: user
      })
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
            console.log("Disagree clicked")
          }
        },
        {
          text: "Agree",
          handler: () => {
            this.todoServiceProvider.deleteList(uuid)
          }
        }
      ]
    })
    confirm.present()
  }
}
