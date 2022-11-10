import { getById, getOrderedTodos } from './getters/gTodos';
import { add, remove, update} from "./actions/aTodos"
import { defineStore } from "pinia"
import { TodoState } from "./interfaces/ITodos"

const state = (): TodoState => ({
  items: []
})

const getters = {
  getById,
  getOrderedTodos
}

const actions = {
  add,
  remove,
  update
}

export const useTodoStore = defineStore("todoStore", {
  state,
  getters,
  actions
})