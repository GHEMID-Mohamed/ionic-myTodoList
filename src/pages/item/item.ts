import { Component, Input, NgZone } from "@angular/core";
import { EditTodoPage } from "../edit-todo/edit-todo";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
  Alert
} from "ionic-angular";
import { TodoServiceProvider } from "../../services/todos.service";
import { ListPage } from "../list/list";
import { ConfirmPage } from "../confirm/confirm";

import { FileChooser } from "@ionic-native/file-chooser";
import { FilePath } from "@ionic-native/file-path";
import { File } from "@ionic-native/file";

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
  firestore = firebase.storage();
  imgsource: any;
  refresh: any;
  complete: boolean;
  noImage: boolean = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController,
    private fileChooser: FileChooser,
    public zone: NgZone,
    public file: File,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    if (this.imgsource === undefined) {
      this.firestore
        .ref()
        .child(this.itemData.uuid)
        .getDownloadURL()
        .then(url => {
          this.zone.run(() => {
            this.imgsource = url;
            this.noImage = false
          });
        })
        .catch(error => {
          this.imgsource = "none"
          this.noImage = true
        });
    }

    this.complete = this.itemData.complete;
  }

  setCompleteTodo() {
    this.todoServiceProvider.setItemComplete(
      this.listUuid,
      this.itemData.uuid,
      this.complete
    );
  }

  showToast(msg, position) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: position
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  addImage() {
    this.fileChooser.open().then(url => {
      (<any>window).FilePath.resolveNativePath(url, result => {
        this.nativepath = result;
        this.uploadImage();
      });
    });
  }

  uploadImage() {
    (<any>window).resolveLocalFileSystemURL(this.nativepath, res => {
      res.file(resFile => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], { type: "image/jpeg" });
          var imageStore = this.firestore.ref().child(this.itemData.uuid);
          imageStore
            .put(imgBlob)
            .then(res => {
              this.showToast("upload sucess", "bottom");
              this.displayImage();
            })
            .catch(err => {
              alert("Upload Failed" + err);
            });
        };
      });
    });
  }

  displayImage() {
    this.firestore
      .ref()
      .child(this.itemData.uuid)
      .getDownloadURL()
      .then(url => {
        this.zone.run(() => {
          this.showToast("Image loaded", "bottom");
          this.imgsource = url;
        });
      });
  }

  onEdit(uuid: string) {
    this.navCtrl.push(EditTodoPage, {
      listUuid: this.listUuid,
      todoItem: this.itemData
    });
  }

  onDelete() {
    this.navCtrl.push(ConfirmPage, {
      listUuid: this.listUuid,
      itemUuid: this.itemData.uuid
    });
  }
}
