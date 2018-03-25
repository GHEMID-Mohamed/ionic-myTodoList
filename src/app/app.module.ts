import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { environment } from "../environments/environment";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { AngularFireAuth } from "angularfire2/auth";
import { SpeechRecognition } from "@ionic-native/speech-recognition";
import { NFC, Ndef } from "@ionic-native/nfc";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { Item } from "../pages/item/item";
import { ListPage } from "../pages/list/list";
import { NewTodoPage } from "../pages/new-todo/new-todo";
import { EditTodoPage } from "../pages/edit-todo/edit-todo";
import { SharedListsPage } from "../pages/shared-lists/shared-lists";
import { AuthentificationPage } from "../pages/authentification/authentification";
import { ProfilPage } from "../pages/profil/profil";
import { FileChooser } from "@ionic-native/file-chooser";
import { FilePath } from "@ionic-native/file-path";
import { File } from "@ionic-native/file";
import { NewListPage } from "../pages/new-list/new-list";
import { EditListPage } from "../pages/edit-list/edit-list";
import { ConfirmPage } from "../pages/confirm/confirm"

import { TodoServiceProvider } from "../services/todos.service";

@NgModule({
  declarations: [
    AuthentificationPage,
    EditTodoPage,
    Item,
    ListPage,
    MyApp,
    NewTodoPage,
    ProfilPage,
    HomePage,
    NewListPage,
    EditListPage,
    SharedListsPage,
    ConfirmPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AuthentificationPage,
    EditTodoPage,
    Item,
    ListPage,
    MyApp,
    NewTodoPage,
    ProfilPage,
    HomePage,
    NewListPage,
    EditListPage,
    SharedListsPage,
    ConfirmPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    TodoServiceProvider,
    AngularFireAuth,
    FileChooser,
    File,
    FilePath,
    SpeechRecognition,
    NFC,
    Ndef
  ]
})
export class AppModule {}
