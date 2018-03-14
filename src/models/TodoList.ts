import { TodoItem } from './TodoItem'

export interface TodoList {
    uuid: string
    name: string
    items?: TodoItem[]
  }