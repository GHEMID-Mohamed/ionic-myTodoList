import { Component } from "@angular/core"
import { NavController, NavParams } from "ionic-angular"
import { TodoServiceProvider } from "../../services/todos.service"
import { Validators, FormBuilder, FormGroup } from "@angular/forms"

@Component({
  selector: "page-new-todo",
  templateUrl: "new-todo.html"
})
export class NewTodoPage {
  private todo: FormGroup

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public todoService: TodoServiceProvider,
    private formBuilder: FormBuilder
  ) {
    this.todo = this.formBuilder.group({
      title: ["", Validators.required],
      description: [""]
    })
  }

  onAddTodo() {
    //this.todoService.addTodo({
    //  title: this.todo.value.title,
    //  description: this.todo.value.description,
    //  state: false
    //})
    console.log(this.todo.value)
    this.navCtrl.pop()
  }
}
