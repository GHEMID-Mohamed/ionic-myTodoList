import { Component } from "@angular/core"
import { IonicPage, NavController, NavParams } from "ionic-angular"
import firebase from "firebase"
import { AngularFireAuth } from "angularfire2/auth"

@IonicPage()
@Component({
  selector: "page-profil",
  templateUrl: "profil.html"
})
export class ProfilPage {
  user: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth
  ) {
    this.user = navParams.get("user")
  }

  logOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.navCtrl.popToRoot()
      })
      .catch(function(error) {})
  }
}
