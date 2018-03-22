import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import firebase from "firebase";
import { AngularFireAuth } from "angularfire2/auth";
import { TodoServiceProvider } from "../../services/todos.service";

import { GooglePlus } from "@ionic-native/google-plus";

@IonicPage()
@Component({
  selector: "page-profil",
  templateUrl: "profil.html",
  providers: [GooglePlus]
})
export class ProfilPage {
  user: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private googlePlus: GooglePlus,
    private afAuth: AngularFireAuth,
    public todoServiceProvider: TodoServiceProvider,
    public platform: Platform
  ) {
    this.user = navParams.get("user");
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.navCtrl.popToRoot();
    });
  }
}
