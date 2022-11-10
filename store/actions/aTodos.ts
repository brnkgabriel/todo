import { Todo, TodoAdd, TodoStore, TodoUpdate } from "../interfaces/ITodos";
import { v4 as uuid } from "uuid"

export function add(this: TodoStore, partialTodo: TodoAdd) {
  const todo: Todo = {
    id: uuid(),
    ...partialTodo,
    done: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  this.items.push(todo)
}

export function remove(this: TodoStore, id: string) {
  this.items = this.items.filter((todo: Todo) => todo.id !== id)
}

export function update(this: TodoStore, id: string, update: TodoUpdate) {
  const index = this.items.findIndex(item => item.id === id)
  this.items[index] = { ...this.items[index], ...update, updatedAt: new Date() }
}