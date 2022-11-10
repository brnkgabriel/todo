import { Todo, TodoState } from "../interfaces/iTodos";

export const getById = (state: TodoState) => (id: string) => {
  return state.items.find((item: Todo) => item.id === id)
}

export const getOrderedTodos = (state: TodoState) => [...state.items]
.sort((a: Todo, b:Todo) => b.createdAt.getTime() - a.createdAt.getTime())

