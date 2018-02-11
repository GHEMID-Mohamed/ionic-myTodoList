import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Item } from '../pages/item/item'
import { ListPage } from '../pages/list/list'
import { NewTodoPage } from '../pages/new-todo/new-todo'
import { EditTodoPage } from '../pages/edit-todo/edit-todo'

import { TodoServiceProvider } from '../services/todos.service'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewTodoPage,
    Item,
    ListPage,
    EditTodoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewTodoPage,
    Item,
    ListPage,
    EditTodoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TodoServiceProvider
  ]
})
export class AppModule {}
