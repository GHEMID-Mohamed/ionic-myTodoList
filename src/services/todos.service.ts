import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { TodoItem } from "../models/TodoItem";
import { TodoList } from "../models/TodoList";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { generateId } from "../utils";
import firebase from "firebase";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { AngularFireAuth } from "angularfire2/auth";
import "rxjs/Rx";
import { first } from "rxjs/operators";

@Injectable()
export class TodoServiceProvider {
  private data: TodoList[] = [];
  private firstLoad: boolean = true;
  private userId: string;
  private sharedLists: Array<object> = [];

  constructor(private afAuth: AngularFireAuth) {}

  listenFireBaseDB() {
    let refLists = firebase.database().ref(`myLists/`);
    refLists.on(
      "value",
      listsSnap => {
        let refUsers = firebase.database().ref(`users/${this.userId}`);
        refUsers.once(
          "value",
          usersSap => {
            const userLists = usersSap.val().lists;
            this.convertData(listsSnap, userLists);

            if (usersSap.val().sharedLists !== undefined) {
              this.convertSharedLists(usersSap.val().sharedLists);
            }
          },
          this
        );
      },
      this
    );

    let refUsers = firebase.database().ref(`users/${this.userId}`);
    refUsers.on(
      "value",
      snapshot => {
        const userLists = snapshot.val().lists;
        this.listenLists(userLists);
      },
      this
    );
  }

  acceptSharedList(list: any): any {
    return firebase
      .database()
      .ref(`users/${this.userId}/lists/${list.listUuid}`)
      .set({
        name: list.name
      })
      .then(() =>
        firebase
          .database()
          .ref(`users/${this.userId}/sharedLists/${list.listUuid}`)
          .remove()
      );
  }

  declineSharedList(list: any): any {
    return firebase
      .database()
      .ref(`users/${this.userId}/sharedLists/${list.listUuid}`)
      .remove();
  }

  convertSharedLists(sharedLists: any) {
    this.sharedLists.length = 0;
    for (let listUuid in sharedLists) {
      this.sharedLists.push({
        listUuid,
        name: sharedLists[listUuid].name
      });
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }

  listenLists(lists: any) {
    let refLists = firebase.database().ref(`myLists/`);
    refLists.once(
      "value",
      snapshot => {
        this.convertData(snapshot, lists);
      },
      this
    );
  }

  convertData(snapshot, lists) {
    this.data.length = 0;
    for (let key in snapshot.val()) {
      if (key in lists) {
        const items: any = [];
        for (let keyItem in snapshot.val()[key].items) {
          items.push({
            uuid: keyItem,
            name: snapshot.val()[key].items[keyItem].name,
            desc: snapshot.val()[key].items[keyItem].desc,
            complete: snapshot.val()[key].items[keyItem].complete
          });
        }
        this.data.push({
          uuid: key,
          name: snapshot.val()[key].name,
          items: items
        });
      }
    }
  }

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
      .ref(`users/${this.userId}/lists/${newListUuid}`)
      .set({
        name
      });
  }

  async editList(nameList, uuidList) {
    const items = await this.getItemsList(uuidList);
    firebase
      .database()
      .ref(`myLists/${uuidList}`)
      .set({
        name: nameList,
        items
      });
  }

  public getList(): Observable<TodoList[]> {
    return Observable.of(this.data);
  }

  public getSharedLists(): Observable<Array<any>> {
    return Observable.of(this.sharedLists);
  }

  public deleteList(uuid: string) {
    firebase
      .database()
      .ref(`myLists/${uuid}`)
      .remove();

    firebase
      .database()
      .ref(`users/${this.userId}/lists/${uuid}`)
      .remove();
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
    let userExists = false;
    if (modeShare === "email") {
      let usersRef = firebase.database().ref();
      return usersRef
        .child("users")
        .orderByChild("email")
        .equalTo(email)
        .once("value")
        .then(snap => {
          if (snap.val() !== null) {
            const userId = Object.keys(snap.val()).pop();
            firebase
              .database()
              .ref(`users/${userId}/sharedLists/${listUuid}`)
              .set({
                name: listName
              });
            userExists = true;
          }
          return userExists;
        });
    } else if (modeShare === "qrcode") {
    }
  }

  public reinitialize() {
    this.data = [];
  }
}
