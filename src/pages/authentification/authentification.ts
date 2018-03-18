import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Platform
} from "ionic-angular";
import { User } from "../../models/user";
import { AngularFireAuth } from "angularfire2/auth";
import firebase from "firebase";
import { GooglePlus } from "@ionic-native/google-plus";
import { HomePage } from "../home/home";
import { TodoServiceProvider } from "../../services/todos.service";

@IonicPage()
@Component({
  selector: "page-authentification",
  templateUrl: "authentification.html",
  providers: [GooglePlus]
})
export class AuthentificationPage {
  user = {} as User;
  loading: boolean = true;

  constructor(
    private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    public platform: Platform
  ) {}

  async loginGoogleNative(): Promise<void> {
    const googlePlusUser = await this.googlePlus.login({
      webClientId:
        "146278318061-ahmheb0n83k1q5ia522qffl75adqct68.apps.googleusercontent.com",
      offline: true,
      scopes: "profile email"
    });

    this.todoServiceProvider.setUserId(googlePlusUser.userId);
    this.todoServiceProvider.listenFireBaseDB();

    const logedUser = this.afAuth.auth.signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(googlePlusUser.idToken)
    );

    if (logedUser !== undefined) this.navCtrl.push(HomePage);
  }

  async loginRegular(): Promise<void> {
    try {
      const user = await this.afAuth.auth.signInWithEmailAndPassword(
        this.user.email,
        this.user.password
      );
      if (user) {
        this.todoServiceProvider.setUserId(user.uid);
        this.todoServiceProvider.listenFireBaseDB();
        this.navCtrl.push(HomePage);
      }
    } catch (e) {
      let alert = this.alertCtrl.create({
        title: "Login",
        subTitle: e.message,
        buttons: ["OK"]
      });
      alert.present();
    }
  }

  async register(userRegistred: User) {
    try {
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(
        userRegistred.email,
        userRegistred.password
      );
      if (user) {
        this.navCtrl.push(HomePage);
      }
    } catch (e) {
      console.error(e);
    }
  }

  loginGoogle(): void {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(user => {
        let token = user.credential.accessToken;
        this.todoServiceProvider.listenFireBaseDB();
        this.navCtrl.push(HomePage, {
          googleLogin: false
        });
      })
      .catch(error => {
        var errorCode = error.code;
        console.log(error.message);
      });
  }
}
