import { Component } from "@angular/core"
import { NavController, NavParams } from "ionic-angular"
import { TodoServiceProvider } from "../../services/todos.service"
import { Validators, FormBuilder, FormGroup } from "@angular/forms"
import { TodoItem } from "../../model/model"
import { generateId } from "../../utils"

@Component({
  selector: "page-new-todo",
  templateUrl: "new-todo.html"
})
export class NewTodoPage {
  todoform: any
  listUuid: string
  todoItem: TodoItem = { name: "", complete: false, desc: "", uuid: "" }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoServiceProvider: TodoServiceProvider,
    private formBuilder: FormBuilder
  ) {
    this.todoform = this.formBuilder.group({
      title: ["", Validators.required],
      description: [""]
    })
    this.listUuid = navParams.get("listUuid")
  }

  onAddTodo() {
    this.todoItem.name = this.todoform.value.title
    this.todoItem.desc = this.todoform.value.description
    this.todoItem.complete = false
    this.todoItem.uuid = generateId()
    this.todoServiceProvider.addTodo(this.listUuid, this.todoItem)
    this.navCtrl.pop()
  }
}
