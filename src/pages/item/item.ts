import { Component, Input } from "@angular/core";
import { EditTodoPage } from "../edit-todo/edit-todo";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { TodoServiceProvider } from "../../services/todos.service";
//import { FileChooser } from "@ionic-native/file-chooser";

import firebase from "firebase";
import { snapshotChanges } from "angularfire2/database";

@Component({
  selector: "item-todo",
  templateUrl: "item.html"
})
export class Item {
  @Input("itemData") itemData;
  @Input("listUuid") listUuid;
  nativepath: any;
  file: any;
  firestore = firebase.storage();
  imgsource: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController,
    //private fileChooser: FileChooser
  ) {}

  addImage() {
    //this.fileChooser.open().then(url => {
    //  (<any>window).FilePath.resolveNativePath(url, result => {
    //    this.nativepath = result;
    //    this.uploadimage();
    //  });
    //});
  }

  uploadimage() {
    //(<any>window).resolveLocalFileSystemURL(this.nativepath, res => {
    //  res.file(resFile => {
    //    var reader = new FileReader();
    //    reader.readAsArrayBuffer(resFile);
    //    reader.onloadend = (evt: any) => {
    //      var imgBlob = new Blob([evt.target.result], { type: "image/jpeg" });
    //      var imageStore = this.firestore.ref().child("image");
    //      imageStore
    //        .put(imgBlob)
    //        .then(res => {
    //          alert("Upload Success");
    //        })
    //        .catch(err => {
    //          alert("Upload Failed" + err);
    //        });
    //    };
    //  });
    //});
  }

  onEdit(uuid: string) {
    this.navCtrl.push(EditTodoPage, {
      listUuid: this.listUuid,
      todoItem: this.itemData
    });
  }

  onDelete() {
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
            this.todoServiceProvider.deleteTodo(
              this.listUuid,
              this.itemData.uuid
            );
          }
        }
      ]
    });
    confirm.present();
  }
}
