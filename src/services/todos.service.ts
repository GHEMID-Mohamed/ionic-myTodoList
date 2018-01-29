export class TodosService {
  private todos: { title: string; description: string; state: boolean }[] = []

  addTodo(todo: { title: string; description: string; state: boolean }) {
    this.todos.push(todo)
  }

  getTodos(): { title: string; description: string; state: boolean }[] {
    return this.todos
  }
}
