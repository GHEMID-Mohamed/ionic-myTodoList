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
  public data: TodoList[] = []
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
    const newListUuid = firebase
      .database()
      .ref()
      .child("myLists")
      .push().key

    firebase
      .database()
      .ref(`myLists/${newListUuid}`)
      .set({
        name: name,
        items: []
      })

    firebase
      .database()
      .ref(`users/${firebase.auth().currentUser.uid}/lists/${newListUuid}`)
      .set({
        name
      })
  }

  convertData(snapshot, uuid) {
    const items: any = []
    if (snapshot.val() !== null && snapshot.val().items !== null) {
      for (let keyItem in snapshot.val().items) {
        items.push({
          uuid: keyItem,
          name: snapshot.val().items[keyItem].name,
          desc: snapshot.val().items[keyItem].desc,
          complete: snapshot.val().items[keyItem].complete
        })
      }

      let index = this.data.findIndex(value => value.uuid === uuid)

      if (index !== -1) {
        this.data[index] = {
          uuid,
          name: snapshot.val().name,
          items: items
        }
      } else {
        this.data.push({
          uuid,
          name: snapshot.val().name,
          items: items
        })
      }
    }
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

  shareList(email, listUuid, listName) {
    return firebase
      .database()
      .ref(`users/`)
      .once("value")
      .then(snapshot => {
        let userExists = false
        for (let userUid in snapshot.val()) {
          if (snapshot.val()[userUid].email === email) {
            userExists = true
            firebase
              .database()
              .ref(`users/${userUid}/lists/${listUuid}`)
              .set({
                name: listName
              })
          }
        }
        return userExists
      })
  }

  public reinitialize() {
    this.data = []
  }
}
