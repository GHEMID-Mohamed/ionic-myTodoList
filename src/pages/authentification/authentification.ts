import { Component } from "@angular/core"
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular"
import { User } from "../../models/user"
import { AngularFireAuth } from "angularfire2/auth"
import firebase from "firebase"
import { GooglePlus } from "@ionic-native/google-plus"
import { HomePage } from '../home/home'

@IonicPage()
@Component({
  selector: "page-authentification",
  templateUrl: "authentification.html",
  providers: [GooglePlus]
})
export class AuthentificationPage {
  user = {} as User

  constructor(
    private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    firebase
      .auth()
      .signOut()
      .then(() => {})
      .catch(function(error) {})
  }

  async login(user: User) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(
        user.email,
        user.password
      )
      if (result) {
        this.navCtrl.push(HomePage)
      }
    } catch (e) {
      let alert = this.alertCtrl.create({
        title: "Login",
        subTitle: e.message,
        buttons: ["OK"]
      })
      alert.present()
    }
  }

  async register(user: User) {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      )
      if (result) {
        this.navCtrl.push(HomePage)
      }
    } catch (e) {
      console.error(e)
    }
  }

  loginGoogle(): void {
    let provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        let token = result.credential.accessToken
        this.navCtrl.push(HomePage)
      })
      .catch(error => {
        var errorCode = error.code
        console.log(error.message)
      })
  }

  loginGoogleNative(): void {
    this.googlePlus
      .login({
        webClientId:
          "146278318061-ahmheb0n83k1q5ia522qffl75adqct68.apps.googleusercontent.com"
      })
      .then(
        res => {
          console.log(res)
        },
        err => {
          console.log(err)
        }
      )
  }

  logout() {
    this.googlePlus.logout().then(() => {
      console.log("logged out")
    })
  }
}
