import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { TodoItem } from "../models/TodoItem";
import { TodoList } from "../models/TodoList";
import { Observable } from "rxjs/Observable";
import { generateId } from "../utils";
import firebase from "firebase";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { AngularFireAuth } from "angularfire2/auth";
import "rxjs/Rx";

@Injectable()
export class TodoServiceProvider {
  public data: TodoList[] = [];

  constructor(private afAuth: AngularFireAuth) {}

  //listenUser() {
  //  this.refUsers = firebase
  //    .database()
  //    .ref(`users/${firebase.auth().currentUser.uid}/lists`);
  //  this.refUsers.on("value", this.handleUsers, this);
  //}

  listenLists() {
    let refUsers = firebase.database().ref(`myLists/`);
    refUsers.on("value", this.convertData, this);
  }

  convertData(snapshot) {
    console.log("appel");
    const data: any = [];
    this.data = [];
    for (let key in snapshot.val()) {
      const items: any = [];
      for (let keyItem in snapshot.val()[key].items) {
        items.push({
          uuid: keyItem,
          name: snapshot.val()[key].items[keyItem].name,
          desc: snapshot.val()[key].items[keyItem].desc,
          complete: snapshot.val()[key].items[keyItem].complete
        });
      }
      data.push({
        uuid: key,
        name: snapshot.val()[key].name,
        items: items
      });
    }
    this.data = data;
  }

  //handleUsers(snapshot) {
  //  for (let uuid in snapshot.val()) {
  //    let refList = firebase.database().ref(`myLists/${uuid}`);
  //    refList.on(
  //      "value",
  //      snapshot => {
  //        this.convertData(snapshot, uuid);
  //      },
  //      this
  //    );
  //  }
  //}

  public AddList(name: string) {
    const newListUuid = firebase
      .database()
      .ref()
      .child("myLists")
      .push().key;

    firebase
      .database()
      .ref(`myLists/${newListUuid}`)
      .set({
        name: name,
        items: []
      });

    firebase
      .database()
      .ref(`users/${firebase.auth().currentUser.uid}/lists/${newListUuid}`)
      .set({
        name
      });
  }

  public getList() {
    return Observable.of(this.data);
  }

  public deleteList(uuid: string) {
    return firebase
      .database()
      .ref(`myLists/${uuid}`)
      .remove();

    //firebase
    //  .database()
    //  .ref(`users/${firebase.auth().currentUser.uid}/lists/${uuid}`)
    //  .remove();
  }

  public getTodos(uuid: String) {
    return Observable.of(this.data.find(d => d.uuid == uuid).items);
  }

  public editTodo(listUuid: String, editedItem: TodoItem) {
    firebase
      .database()
      .ref(`myLists/${listUuid}/items/${editedItem.uuid}`)
      .set(editedItem);
  }

  public deleteTodo(listUuid: String, uuid: String) {
    firebase
      .database()
      .ref(`myLists/${listUuid}/items/${uuid}`)
      .remove();
  }

  public addTodo(listUuid: String, addedItem: TodoItem) {
    const newTodoKey = firebase
      .database()
      .ref()
      .child("items")
      .push().key;
    firebase
      .database()
      .ref(`myLists/${listUuid}/items/${newTodoKey}`)
      .set({
        name: addedItem.name,
        desc: addedItem.desc,
        complete: false
      });
  }

  public getItemsList(listUuid: string) {
    return firebase
      .database()
      .ref(`myLists/${listUuid}/items`)
      .once("value")
      .then(snapshot => snapshot.val());
  }

  shareList(email, listUuid, listName, modeShare) {
    if (modeShare === "share") {
      return firebase
        .database()
        .ref(`users/`)
        .once("value")
        .then(snapshot => {
          let userExists = false;
          for (let userUid in snapshot.val()) {
            if (snapshot.val()[userUid].email === email) {
              userExists = true;
              firebase
                .database()
                .ref(`users/${userUid}/lists/${listUuid}`)
                .set({
                  name: listName
                });
            }
          }
          return userExists;
        });
    } else if (modeShare === "copy") {
      return firebase
        .database()
        .ref(`users/`)
        .once("value")
        .then(snapshot => {
          let userExists = false;
          for (let userUid in snapshot.val()) {
            if (snapshot.val()[userUid].email === email) {
              userExists = true;
              this.getItemsList(listUuid).then(items => {
                const newListUuid = firebase
                  .database()
                  .ref()
                  .child("myLists")
                  .push().key;

                firebase
                  .database()
                  .ref(`myLists/${newListUuid}`)
                  .set({
                    name: listName,
                    items
                  });

                firebase
                  .database()
                  .ref(`users/${userUid}/lists/${newListUuid}`)
                  .set({
                    listName
                  });
                return userExists;
              });
            }
            return userExists;
          }
        });
    }
  }

  public reinitialize() {
    this.data = [];
  }
}
