import { BrowserModule } from "@angular/platform-browser"
import { ErrorHandler, NgModule } from "@angular/core"
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular"
import { AngularFireModule } from "angularfire2"
import { AngularFireDatabaseModule } from "angularfire2/database"
import { environment } from "../environments/environment"
import { SplashScreen } from "@ionic-native/splash-screen"
import { StatusBar } from "@ionic-native/status-bar"
import { AngularFireAuth } from "angularfire2/auth"

import { MyApp } from "./app.component"
import { HomePage } from "../pages/home/home"
import { Item } from "../pages/item/item"
import { ListPage } from "../pages/list/list"
import { NewTodoPage } from "../pages/new-todo/new-todo"
import { EditTodoPage } from "../pages/edit-todo/edit-todo"
import { AuthentificationPage } from "../pages/authentification/authentification"
import { ProfilPage } from "../pages/profil/profil"

import { TodoServiceProvider } from "../services/todos.service"

@NgModule({
  declarations: [
    AuthentificationPage,
    EditTodoPage,
    Item,
    ListPage,
    MyApp,
    NewTodoPage,
    ProfilPage,
    HomePage
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
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    TodoServiceProvider,
    AngularFireAuth
  ]
})
export class AppModule {}
