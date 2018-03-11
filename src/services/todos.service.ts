import { Injectable } from "@angular/core"
import { Http } from "@angular/http"
import { TodoItem } from "../models/TodoItem"
import { TodoList } from "../models/TodoList"
import { Observable } from "rxjs/Observable"
import { generateId } from "../utils"
import firebase from "firebase"
import { ReplaySubject } from "rxjs/ReplaySubject"
import { AngularFireAuth } from "angularfire2/auth"
import "rxjs/Rx"

@Injectable()
export class TodoServiceProvider {
  data: TodoList[] = []
  refLists: any
  refUsers: any

  constructor(private afAuth: AngularFireAuth) {
    this.listenUser()
  }

  listenUser() {
    this.refLists = firebase
      .database()
      .ref(`users/${firebase.auth().currentUser.uid}/lists`)
    this.refLists.on("value", this.handleUsers, this)
  }

  handleUsers(snapshot) {
    for (let uuid in snapshot.val()) {
      let refList = firebase.database().ref(`myLists/${uuid}`)
      refList.on(
        "value",
        snapshot => {
          this.convertData(snapshot, uuid)
        },
        this
      )
    }
  }

  public AddList(name: string) {
    firebase
      .database()
      .ref(`myLists/${generateId()}`)
      .set({
        name: name,
        items: []
      })
  }

  convertData(snapshot, uuid) {
    const items: any = []
    for (let keyItem in snapshot.val().items) {
      items.push({
        uuid: keyItem,
        name: snapshot.val().items[keyItem].name,
        desc: snapshot.val().items[keyItem].desc,
        complete: snapshot.val().items[keyItem].complete
      })
    }
    if (!this.listExists(uuid)) {
      this.data.push({
        uuid,
        name: snapshot.val().name,
        items: items
      })
    }
  }

  listExists(uuid) {
    let exists = false
    this.data.map(list => {
      if (list.uuid === uuid) {
        exists = true
      }
    })
    return exists
  }

  public getList() {
    return Observable.of(this.data)
  }

  public deleteList(uuid: string) {
    firebase
      .database()
      .ref(`myLists/${uuid}`)
      .remove()
  }

  public getTodos(uuid: String) {
    return Observable.of(this.data.find(d => d.uuid == uuid).items)
  }

  public editTodo(listUuid: String, editedItem: TodoItem) {
    firebase
      .database()
      .ref(`myLists/${listUuid}/items/${editedItem.uuid}`)
      .set(editedItem)
  }

  public deleteTodo(listUuid: String, uuid: String) {
    firebase
      .database()
      .ref(`myLists/${listUuid}/items/${uuid}`)
      .remove()
  }

  public addTodo(listUuid: String, addedItem: TodoItem) {
    const newTodoKey = firebase
      .database()
      .ref()
      .child("items")
      .push().key
    firebase
      .database()
      .ref(`myLists/${listUuid}/items/${newTodoKey}`)
      .set({
        name: addedItem.name,
        desc: addedItem.desc,
        complete: false
      })
  }
}
