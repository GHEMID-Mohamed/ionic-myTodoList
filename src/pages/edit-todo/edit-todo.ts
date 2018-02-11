import { Component } from "@angular/core"
import { IonicPage, NavController, NavParams } from "ionic-angular"
import { Validators, FormBuilder, FormGroup } from "@angular/forms"
import { TodoItem } from "../../model/model"
import { TodoServiceProvider } from "../../services/todos.service"

@Component({
  selector: "page-edit-todo",
  templateUrl: "edit-todo.html"
})
export class EditTodoPage {
  todoEditForm: any
  todoItem: TodoItem = { name: "", complete: false, desc: "", uuid: "" }
  listUuid: string

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private todoServiceProvider: TodoServiceProvider
  ) {
    this.todoItem = this.navParams.get("todoItem")
    this.listUuid = this.navParams.get("listUuid")

    this.todoEditForm = this.formBuilder.group({
      title: [this.todoItem.name, Validators.required],
      description: [this.todoItem.desc]
    })
  }

  onEditTodo() {
    this.todoItem.name = this.todoEditForm.value.title
    this.todoItem.desc = this.todoEditForm.value.description
    this.todoServiceProvider.editTodo(this.listUuid, this.todoItem)
    this.navCtrl.pop()
  }
}
