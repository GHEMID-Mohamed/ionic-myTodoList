import { Injectable } from "@angular/core"
import { Http } from "@angular/http"
import { TodoItem } from "../models/TodoItem"
import { TodoList } from "../models/TodoList"
import { Observable } from "rxjs/Observable"
import { generateId } from "../utils"
import firebase from "firebase"
import { ReplaySubject } from "rxjs/ReplaySubject"
import "rxjs/Rx"

@Injectable()
export class TodoServiceProvider {
  data: TodoList[] = []
  ref: any

  constructor() {
    this.ref = firebase.database().ref("myLists/")
    this.ref.on("value", this.convertData, this)
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

  convertData(snapshot) {
    const data: any = []
    for (let key in snapshot.val()) {
      const items: any = []
      for (let keyItem in snapshot.val()[key].items) {
        items.push({
          uuid: keyItem,
          name: snapshot.val()[key].items[keyItem].name,
          desc: snapshot.val()[key].items[keyItem].desc,
          complete: snapshot.val()[key].items[keyItem].complete
        })
      }
      data.push({
        uuid: key,
        name: snapshot.val()[key].name,
        items: items
      })
    }
    this.data = data
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
